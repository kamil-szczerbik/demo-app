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
            roundsNumber: 1,        // ← jest int, bo jakoś magicznie string na serwerze staje się intem
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
            victories: Array(4).fill(0),
            URLs: [],

            //to się tyczy configa
            players: ['Wolne miejsce', 'Wolne miejsce', 'Wolne miejsce', 'Wolne miejsce'],
            availableSeats: [true, true, true, true],

            amISitting: false,
            mySeat: null,
            started: false,

            creator: '',
            type: '',
            password: '',

            message: '',
            message2: '' //zwycięstwo / stopGame
        }

        this.room = this.props.location.state.boardId;

        this.sit = this.sit.bind(this);
        this.getUp = this.getUp.bind(this);
        this.handover = this.handover.bind(this);
        this.kick = this.kick.bind(this);
        this.handlePlayersNumber = this.handlePlayersNumber.bind(this);
        this.handleRoundsNumber = this.handleRoundsNumber.bind(this);
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

                    this.setState({ players: newPlayers, availableSeats: newAvailableSeats, playersNumber: newPlayersNumber, roundsNumber: response.roundsNumber, started: response.started, type: response.type, password: newPassword, creator: response.creator});
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
            this.setState({ creator: newCreator, password: '' });
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

        socket.on('setRoundsNumber', (value) => {
            this.setState({ roundsNumber: value });
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

        socket.on('stopGame', (username) => {
            const newMessage2 = `Niestety, użytkownik ${username} opuścił grę.`
            this.setState({ message2: newMessage2 });
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
        });

        socket.on('endMatch', (data) => {
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
                message: data.message,
                URLs: newURLs,
                victories: data.victories
            });
        });

        socket.on('endGame', (data) => {
            this.setState({score: data.score, message2: data.message, victories: data.victories});
        });
    }

    componentWillUnmount() {
            socket.emit('leaveBoard', this.room, this.props.location.state.username);
            socket.off('take-a-seat');
            socket.off('getUp');
            socket.off('handover');
            socket.off('changePlayersNumber');
            socket.off('setRoundsNumber');
            socket.off('setGameType')
            socket.off('getPassword')
            socket.off('userLeft');
            socket.off('startGame');
            socket.off('endMatch');
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

    handleRoundsNumber(e) {
        const roundsNumber = parseInt(e.target.value);
        socket.emit('setRoundsNumber', this.room, roundsNumber);
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
            this.setState({ message: 'Brak wymaganej ilości graczy!' });
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
                <Config username={this.props.location.state.username} room={this.room} creator={this.state.creator} players={this.state.players} playersNumber={this.state.playersNumber} availableSeats={this.state.availableSeats} amISitting={this.state.amISitting} started={this.state.started} roundsNumber={this.state.roundsNumber} victories={this.state.victories} type={this.state.type} password={this.state.password} handlePlayersNumber={this.handlePlayersNumber} handleRoundsNumber={this.handleRoundsNumber} handleType={this.handleType} sit={this.sit} getUp={this.getUp} handover={this.handover} kick={this.kick} startGame={this.startGame}/>
                {
                    this.state.message &&
                    <Alert text={this.state.message} cancel={() => this.setState({ message: '' })} />
                }
                {
                    this.state.message2 &&
                    <DoubleButtonAlert text={this.state.message2} button1='Rewanż (WIP)' button2='Wyjdź' handleButton1={this.restartGame} handleButton2={this.quitGame} />
                }  
            </div>
            );
    }
}

export default Game;