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
            playersNumber: 2,       
            roundsNumber: 1,        

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

            sittingPlayers: ['Wolne miejsce', 'Wolne miejsce', 'Wolne miejsce', 'Wolne miejsce'],
            availableSeats: [true, true, true, true],

            amISitting: false,
            mySeat: null,
            started: false,

            leader: '',
            gameType: '',
            password: '',

            alertMessage: '',
            doubleButtonAlertMessage: ''
        }

        this.room = this.props.location.state.boardId;

        this.sitDown = this.sitDown.bind(this);
        this.getUp = this.getUp.bind(this);
        this.passLeaderPrivileges = this.passLeaderPrivileges.bind(this);
        this.kick = this.kick.bind(this);
        this.handlePlayersNumber = this.handlePlayersNumber.bind(this);
        this.handleRoundsNumber = this.handleRoundsNumber.bind(this);
        this.handleGameType = this.handleGameType.bind(this);
        this.startGame = this.startGame.bind(this);
        this.setScore = this.setScore.bind(this);
        this.handleDeleteBoard = this.handleDeleteBoard.bind(this);

        this.restartGame = this.restartGame.bind(this);
        this.quitGame = this.quitGame.bind(this);
    }

    componentDidMount() {
        this.initializeSockets();
        this.tryGetBoardData();
    }

    initializeSockets() {
        socket.on('sitDown', (username, seat) => {
            const newSittingPlayers = { ...this.state.sittingPlayers };
            const newAvailableSeats = { ...this.state.availableSeats };

            newSittingPlayers[seat] = username;
            newAvailableSeats[seat] = false;

            this.setState({ sittingPlayers: newSittingPlayers, availableSeats: newAvailableSeats });
        });

        socket.on('getUp', (seat) => {
            const newSittingPlayers = { ...this.state.sittingPlayers };
            const newAvailableSeats = { ...this.state.availableSeats };

            newSittingPlayers[seat] = 'Wolne miejsce';
            newAvailableSeats[seat] = true;

            this.setState({ sittingPlayers: newSittingPlayers, availableSeats: newAvailableSeats });
        });

        socket.on('changePlayersNumber', (newPlayersNumber) => {
            const newSittingPlayers = { ...this.state.sittingPlayers };
            const newAvailableSeats = { ...this.state.availableSeats };
            let newAmISitting = this.state.amISitting;

            if (newPlayersNumber <= 3) {
                newSittingPlayers[3] = 'Wolne miejsce';
                newAvailableSeats[3] = true;

                if (this.props.location.state.username === this.state.sittingPlayers[3])
                    newAmISitting = false;

                if (newPlayersNumber === 2) {
                    newSittingPlayers[2] = 'Wolne miejsce';
                    newAvailableSeats[2] = true;

                    if (this.props.location.state.username === this.state.sittingPlayers[2])
                        newAmISitting = false;
                }
            }

            this.setState({ sittingPlayers: newSittingPlayers, availableSeats: newAvailableSeats, amISitting: newAmISitting, playersNumber: newPlayersNumber });
        });

        socket.on('changeRoundsNumber', (newRoundsNumber) => {
            this.setState({ roundsNumber: newRoundsNumber });
        });

        socket.on('changeGameType', (newGameType) => {
            this.setState({ gameType: newGameType });
        });

        socket.on('getPassword', (newPassword) => {
            this.setState({ password: newPassword })
        });

        socket.on('passLeaderPrivileges', (newLeader) => {
            this.setState({ leader: newLeader, password: '' });
        });

        socket.on('userLeft', (username) => {
            for (let i = 0; i < this.state.playersNumber; i++) {
                if (username === this.state.sittingPlayers[i]) {
                    socket.emit('getUp', username, this.room, i);
                    break;
                }
            }
        });

        socket.on('kickOthers', () => {
            this.setState({ alertMessage: 'Założyciel rozwiązał stół. Kliknij aby wrócić do strony głównej.' });
        });

        socket.on('stopGame', (username) => {
            this.setState({ doubleButtonAlertMessage: `Niestety, użytkownik ${username} opuścił grę.` });
        });

        socket.on('startGame', (initialData) => {
            let newURLs = [];
            for (let i = 0; i < 5; i++) {
                newURLs[i] = `/img/dice${initialData.dices[i]}_test.png`;
            }
            this.setState({
                activePlayer: initialData.activePlayer,
                rollNumber: initialData.rollNumber,
                proposedValues: initialData.proposedValues,
                posArray: initialData.posArray,
                rotArray: initialData.rotArray,
                score: initialData.score,
                URLs: newURLs,
                started: initialData.started
            });
        });

        socket.on('endRound', (newRoundData) => {
            let newURLs = [];
            for (let i = 0; i < 5; i++) {
                newURLs[i] = `/img/dice${newRoundData.dices[i]}_test.png`;
            }
            this.setState({
                activePlayer: newRoundData.activePlayer,
                rollNumber: newRoundData.rollNumber,
                proposedValues: newRoundData.proposedValues,
                posArray: newRoundData.posArray,
                rotArray: newRoundData.rotArray,
                score: newRoundData.score,
                alertMessage: newRoundData.message,
                URLs: newURLs,
                victories: newRoundData.victories
            });
        });

        socket.on('endGame', (finalData) => {
            this.setState({ score: finalData.score, doubleButtonAlertMessage: finalData.message, victories: finalData.victories });
        });
    }

    tryGetBoardData() {
        try {
            this.getBoardData();
        }
        catch (err) {
            console.log('Coś poszło nie tak: ' + err);
        }
    }

    async getBoardData() {
        const boardDataResponse = await fetch('/api/getBoard', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.room
            })
        });

        if (boardDataResponse.status === 200)
            this.handleFetchedBoardData(boardDataResponse);
        else
            this.setState({ alertMessage: 'Coś poszło nie tak. Spróbuj ponownie.' });
    }

    async handleFetchedBoardData(boardDataResponse) {
        const boardDataResponseJSON = await boardDataResponse.json();

        const updatedData = this.updateData(boardDataResponseJSON);
        this.setUpdatedData(boardDataResponseJSON, updatedData)
    }

    updateData(boardDataResponseJSON) {
        const updatedData = {
            newSittingPlayers: [],
            newAvailableSeats: []
        };

        updatedData.newPlayersNumber = parseInt(boardDataResponseJSON.playersNumber);

        for (let i = 0; i < 4; i++) {
            if (boardDataResponseJSON.players[i]) {
                updatedData.newPlayers[i] = boardDataResponseJSON.players[i];
                updatedData.newAvailableSeats[i] = false;
            }
            else {
                updatedData.newSittingPlayers[i] = this.state.sittingPlayers[i];
                updatedData.newAvailableSeats[i] = this.state.availableSeats[i];
            }
        }

        if (this.props.location.state.username === boardDataResponseJSON.leader)
            updatedData.newPassword = boardDataResponseJSON.password;
        else
            updatedData.newPassword = '';

        return updatedData;
    }

    setUpdatedData(boardDataResponseJSON, updatedData) {
        this.setState({
            roundsNumber: boardDataResponseJSON.roundsNumber,
            started: boardDataResponseJSON.started,
            gameType: boardDataResponseJSON.type,
            leader: boardDataResponseJSON.leader,

            sittingPlayers: updatedData.newSittingPlayers,
            availableSeats: updatedData.newAvailableSeats,
            playersNumber: updatedData.newPlayersNumber,
            password: updatedData.newPassword
        });
    }

    sitDown(seat) {
        if (this.state.availableSeats[seat]) {
            this.setState({ amISitting: true, mySeat: seat });
            socket.emit('sitDown', this.props.location.state.username, this.room, seat);
        }
    }

    getUp(seat) {
        this.setState({ amISitting: false, mySeat: null });
        socket.emit('getUp', this.props.location.state.username, this.room, seat);
    }

    passLeaderPrivileges(newLeader) {
        socket.emit('passLeaderPrivileges', this.room, newLeader);
    }

    kick(player, seat) {
        socket.emit('getUp', player, this.room, seat);
    }

    handlePlayersNumber(e) {
        const newPlayersNumber = parseInt(e.target.value);
        socket.emit('changePlayersNumber', this.room, newPlayersNumber);
    }

    handleRoundsNumber(e) {
        const newRoundsNumber = parseInt(e.target.value);
        socket.emit('changeRoundsNumber', this.room, newRoundsNumber);
    }

    handleGameType(e) {
        if (e.target.value === 'public')
            socket.emit('changeGameType', this.room, true);
        else
            socket.emit('changeGameType', this.room, false);
    }

    startGame() {
        const readiness = this.checkSeats();

        if (readiness)
            socket.emit('startGame', this.room);
        else
            this.showAlert('Brak wymaganej ilości graczy!')
    }

    checkSeats() {
        for (let i = 0; i < this.state.playersNumber; i++)
            if (this.state.sittingPlayers[i] === 'Wolne miejsce')
                return false;

        return true;
    }

    setScore(chosenCategory) {
        socket.emit('setScore', this.room, chosenCategory);
    }

    restartGame() {
        this.setState({ doubleButtonAlertMessage: '' });
        socket.emit('startGame', this.room);
    }

    quitGame() {
        this.props.history.replace('/');
    }

    async handleDeleteBoard() {
        const response = await fetch('/api/deleteBoard', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.room
            })
        });
        if (response.status === 200) {
            socket.emit('updateBoardsList');
            socket.emit('kickOthers', this.room);
            this.props.history.push('/');
            //Wykonuje się ComponentWillUnmount, więc socket off tu nie muszę umieszczać
        }
    }

    showAlert(message) {
        this.setState({ alertMessage: message });
    }

    componentWillUnmount() {
        socket.emit('leaveBoard', this.room, this.props.location.state.username);
        socket.off('sitDown');
        socket.off('getUp');
        socket.off('passLeaderPrivileges');
        socket.off('changePlayersNumber');
        socket.off('changeRoundsNumber');
        socket.off('changeGameType')
        socket.off('getPassword')
        socket.off('userLeft');
        socket.off('startGame');
        socket.off('endRound');
        socket.off('endGame');
        socket.off('kickOthers');
    }

    render() {
        return (
            <div>
                <Table
                    mySeat={this.state.mySeat}
                    proposedValues={this.state.proposedValues}
                    score={this.state.score}
                    activePlayer={this.state.activePlayer}
                    setScore={this.setScore}
                    playersNumber={this.state.playersNumber}
                />
                <Dices
                    mySeat={this.state.mySeat}
                    activePlayer={this.state.activePlayer}
                    room={this.room}
                    urlDices={this.state.URLs}
                    posArray={this.state.posArray}
                    rotArray={this.state.rotArray}
                    rollNumber={this.state.rollNumber}
                />
                <Config
                    username={this.props.location.state.username}
                    room={this.room}
                    leader={this.state.leader}
                    sittingPlayers={this.state.sittingPlayers}
                    playersNumber={this.state.playersNumber}
                    availableSeats={this.state.availableSeats}
                    amISitting={this.state.amISitting}
                    started={this.state.started}
                    roundsNumber={this.state.roundsNumber}
                    victories={this.state.victories}
                    gameType={this.state.gameType}
                    password={this.state.password}
                    handlePlayersNumber={this.handlePlayersNumber}
                    handleRoundsNumber={this.handleRoundsNumber}
                    handleGameType={this.handleGameType}
                    sitDown={this.sitDown}
                    getUp={this.getUp}
                    passLeaderPrivileges={this.passLeaderPrivileges}
                    kick={this.kick}
                    startGame={this.startGame}
                    handleDeleteBoard={this.handleDeleteBoard}
                />
                {
                    this.state.alertMessage &&
                    <Alert text={this.state.alertMessage} cancel={() => this.setState({ alertMessage: '' })} />
                }
                {
                    this.state.doubleButtonAlertMessage &&
                    <DoubleButtonAlert
                        text={this.state.doubleButtonAlertMessage}
                        button1='Rewanż (WIP)'
                        button2='Wyjdź'
                        handleButton1={this.restartGame}
                        handleButton2={this.quitGame}
                    />
                }  
            </div>
            );
    }
}

export default Game;