//Komponent, będący rodzicem 3 komponentów w kościach (tabela, gra i config), do niego są oddelegowywane prawie wszystkie funkcje, bo
//z reguły działanie funkcji w jednym z komponentów kości, ma wpływ na inny (przekazywanie danych pomiędzy rodzeństwem)

import React, { Component } from 'react';
import Dices from './Dices';
import Table from './Table';
import Config from './Config';
import Alert from '../alerts/Alert';
import DoubleButtonAlert from '../alerts/DoubleButtonAlert';
import socket from '../../nonUI/socketIO';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playersNumber: 2,       //ilu graczy (string, bo wartość atrybutu value inputa radio w Configu nie może być liczbą)
            //to z paczki 
            activePlayer: 0,
            rollNumber: 0,
            proposedValues: [],
            posArray: [[], []],
            rotArray: [],
            score: [
                Array(15).fill(null),
                Array(15).fill(null),
                Array(15).fill(null),
                Array(15).fill(null)
            ],
            URLs: [],

            //to się tyczy configa
            showAlert: false,
            players: ['Wolne miejsce', 'Wolne miejsce', 'Wolne miejsce', 'Wolne miejsce'],
            availableSeats: [true, true, true, true],

            amISitting: false,
            mySeat: null,
            started: false,

            creator: '',
            type: '',
            password: '',

            winnerMessage: ''
        }

        this.room = this.props.location.state.boardId;

        this.sit = this.sit.bind(this);
        this.getUp = this.getUp.bind(this);
        this.handover = this.handover.bind(this);
        this.kick = this.kick.bind(this);
        this.handlePlayersNumber = this.handlePlayersNumber.bind(this);
        this.handleType = this.handleType.bind(this);
        this.startGame = this.startGame.bind(this);
        this.setScore = this.setScore.bind(this);

        this.restartGame = this.restartGame.bind(this);
        this.quitGame = this.quitGame.bind(this);
    }

    componentDidMount() {
        try {
            fetch('/api/getBoard', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: this.room
                })
            })
                .then(response => {
                    return response.json();
                })
                .then(response => {
                    const newPlayers = { ...this.state.players };
                    const newAvailableSeats = { ...this.state.availableSeats };
                    const newPlayersNumber = parseInt(response.playersNumber);

                    for (let i = 0; i < newPlayersNumber; i++) {
                        if (response.players[i]) {
                            newPlayers[i] = response.players[i];
                            newAvailableSeats[i] = false;
                        }
                    }

                    let newPassword = '';
                    if (this.props.location.state.username === response.creator) {
                        newPassword = response.password;
                    }

                    this.setState({ players: newPlayers, availableSeats: newAvailableSeats, playersNumber: newPlayersNumber, started: response.started, type: response.type, password: newPassword, creator: response.creator});
                });
        }
        catch (err) {
            console.log(err);
        }

        socket.on('take-a-seat', (username, seat) => {
            const newPlayers = { ...this.state.players };
            const newAvailableSeats = { ...this.state.availableSeats };

            newPlayers[seat] = username;
            newAvailableSeats[seat] = false;

            this.setState({ players: newPlayers, availableSeats: newAvailableSeats });
        });

        socket.on('getUp', (seat) => {
            const newPlayers = { ...this.state.players };
            const newAvailableSeats = { ...this.state.availableSeats };

            newPlayers[seat] = 'Wolne miejsce';
            newAvailableSeats[seat] = true;

            this.setState({ players: newPlayers, availableSeats: newAvailableSeats });
        });

        socket.on('handover', (newCreator) => {
            this.setState({ creator: newCreator });
        });

        socket.on('changePlayersNumber', (value) => {
            
            const newPlayers = { ...this.state.players };
            const newAvailableSeats = { ...this.state.availableSeats };
            let newAmISitting = this.state.amISitting;

            for (let i = 0; i < 4; i++) {
                if (i >= value) {
                    newPlayers[i] = 'Wolne miejsce';
                    newAvailableSeats[i] = true;

                    if (this.props.location.state.username === this.state.players[i])
                        newAmISitting = false;
                }
            }
            this.setState({ players: newPlayers, availableSeats: newAvailableSeats, amISitting: newAmISitting, playersNumber: value });
        });

        socket.on('setGameType', (newType) => {
            this.setState({ type: newType });
        });

        socket.on('getPassword', (newPassword) => {
            this.setState({ password: newPassword })
        });

        socket.on('userLeft', (username) => {
            for (let i = 0; i < this.state.playersNumber; i++) {
                if (username === this.state.players[i]) {
                    socket.emit('getUp', username, this.room, i);
                    break;
                }
            }
        });

        socket.on('startGame', (data) => {
            let newURLs = [];
            for (let i = 0; i < 5; i++) {
                newURLs[i] = `/img/dice${data.dices[i]}_test.png`;
            }
            this.setState({
                activePlayer: data.activePlayer,
                rollNumber: data.rollNumber,
                proposedValues: data.proposedValues,
                posArray: data.posArray,
                rotArray: data.rotArray,
                score: data.score,
                URLs: newURLs,
                started: true
            });

            /*socket.off('take-a-seat');
            socket.off('getUp');
            socket.off('changePlayersNumber');
            socket.off('setGameType');
            socket.off('getPassword')*/
            //startgame musi być bo używamy do innych rzeczy
        });

        socket.on('endGame', (data) => {
            this.setState({score: data.lastScore, winnerMessage: data.message});
        });
    }

    componentWillUnmount() {
        /*if (this.state.mySeat !== null) {
            socket.emit('getUp', this.props.location.state.username, this.room, this.state.mySeat);
        }*/
        // ^ Co tu zrobić - chyba w configu trzeba tu dać jakąś zmianę state warunkową

        socket.emit('leaveBoard', this.room, this.props.location.state.username);

        socket.off('take-a-seat');
        socket.off('getUp');
        socket.off('handover');
        socket.off('changePlayersNumber');
        socket.off('setGameType')
        socket.off('getPassword')
        socket.off('userLeft');
        socket.off('startGame');
        socket.off('endGame');
    }

    sit(seat) {
        const newSeat = seat;
        //Tu chyba powinna być zmiana lokalna, a do reszty wyemitować zmianę bez tego kto ją wysłał - oszczędność serwera, tylko co jeśli ktoś kliknie w tym samym momencie?
        if (this.state.players[newSeat] === 'Wolne miejsce') {
            this.setState({ amISitting: true, mySeat: seat });
            socket.emit('take-a-seat', this.props.location.state.username, this.room, newSeat);
        }
    }

    getUp(seat) {
        this.setState({ amISitting: false, mySeat: null });
        socket.emit('getUp', this.props.location.state.username, this.room, seat);
    }

    handover(newPlayer) {
        socket.emit('handover', this.room, newPlayer);
    }

    kick(player, seat) {
        socket.emit('getUp', player, this.room, seat);
    }

    handlePlayersNumber(e) {
        socket.emit('changePlayersNumber', this.room, e.target.value);
    }

    handleType(e) {
        if (e.target.value === 'public') {
            socket.emit('setGameType', this.room, true);
        }
        else {
            socket.emit('setGameType', this.room, false);
        }
    }

    startGame(e) {
        e.preventDefault();
        let ready = true;

        for (let i = 0; i < this.state.playersNumber; i++)
            if (this.state.players[i] === 'Wolne miejsce')
                ready = false;

        if (ready) {
            socket.emit('startGame', this.room);
        }
        else {
            this.setState({ showAlert: true });
        }
    }

    setScore(e) {
        const chosenValue = e.target.getAttribute('value');
        socket.emit('setScore', this.room, chosenValue);
    }

    restartGame() {
        this.setState({ text: '' });
        socket.emit('startGame', this.room);
    }

    quitGame() {
        this.props.history.replace('/'); //React Router używa History API z HTML5 history.replace zastępuje aktualną ścieżkę, push przekierowałoby, a poprzednia strona zostałaby zapamiętana.
    }

    render() {
        return (
            <div>
                <Table mySeat={this.state.mySeat} proposedValues={this.state.proposedValues} score={this.state.score} activePlayer={this.state.activePlayer} setScore={this.setScore} playersNumber={this.state.playersNumber}/>
                <Dices mySeat={this.state.mySeat} activePlayer={this.state.activePlayer} room={this.room} urlDices={this.state.URLs} posArray={this.state.posArray} rotArray={this.state.rotArray} rollNumber={this.state.rollNumber} />
                <Config username={this.props.location.state.username} room={this.room} creator={this.state.creator} players={this.state.players} playersNumber={this.state.playersNumber} availableSeats={this.state.availableSeats} amISitting={this.state.amISitting} started={this.state.started} type={this.state.type} password={this.state.password} handlePlayersNumber={this.handlePlayersNumber} handleType={this.handleType} sit={this.sit} getUp={this.getUp} handover={this.handover} kick={this.kick} startGame={this.startGame}/>
                {
                    this.state.winnerMessage &&
                    <DoubleButtonAlert text={this.state.winnerMessage} button1='Rewanż' button2='Wyjdź' handleButton1={this.restartGame} handleButton2={this.quitGame} />
                }  
                {
                    this.state.showAlert &&
                    <Alert text='Brak wymaganej ilości graczy!' cancel={() => this.setState({ showAlert: false })} />
                }
            </div>
            );
    }
}

export default Game;