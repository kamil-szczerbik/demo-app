import React, { Component } from 'react';
import Dices from './Dices';
import Table from './Table';
import Config from './Config';
import Alert from '../alerts/Alert';
import DoubleButtonAlert from '../alerts/DoubleButtonAlert';
import socket from '../../nonUI/socketIO';
import gameStyle from '../../css/game.module.css';

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
        this.kickPlayer = this.kickPlayer.bind(this);
        this.handlePlayersNumber = this.handlePlayersNumber.bind(this);
        this.handleRoundsNumber = this.handleRoundsNumber.bind(this);
        this.handleGameType = this.handleGameType.bind(this);
        this.startGame = this.startGame.bind(this);
        this.sendChatboxMessage = this.sendChatboxMessage.bind(this);
        this.addPoints = this.addPoints.bind(this);

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

        socket.on('kickPlayer', (seat) => {
            if (this.props.location.state.username === this.state.sittingPlayers[seat])
                this.showAlert('Zostałeś wyrzucony ze stołu. Możesz jednak zostać w pokoju i obserwować rozgrywkę.');

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
            if (this.props.location.state.username === newLeader)
                this.showAlert('Zostałeś nowym przywódcą stołu!');

            this.setState({ leader: newLeader, password: '' });
        });

        socket.on('stopGame', (username) => {
            this.setState({ doubleButtonAlertMessage: `Niestety, użytkownik ${username} opuścił grę.` });
        });

        socket.on('getNewRollData', (newTurnData) => {
            let newURLs = [];
            for (let i = 0; i < 5; i++)
                newURLs[i] = `/img/dice${newTurnData.dices[i]}_test.png`;

            const oldScore = this.state.score;

            oldScore[newTurnData.prevActivePlayer] = newTurnData.score;

            this.setState({
                URLs: newURLs,
                posArray: newTurnData.dicesPosition,
                rotArray: newTurnData.dicesRotation,
                rollNumber: newTurnData.rollNumber,
                activePlayer: newTurnData.activePlayer,
                proposedValues: newTurnData.proposedPoints,
                score: oldScore,
                started: newTurnData.started
            });
        });

        socket.on('endRound', (newRoundData) => {
            let newURLs = [];
            for (let i = 0; i < 5; i++)
                newURLs[i] = `/img/dice${newRoundData.dices[i]}_test.png`;

            this.setState({
                URLs: newURLs,
                posArray: newRoundData.dicesPosition,
                rotArray: newRoundData.dicesRotation,
                rollNumber: newRoundData.rollNumber,
                activePlayer: newRoundData.activePlayer,
                proposedValues: newRoundData.proposedPoints,
                score: newRoundData.score,
                alertMessage: newRoundData.winnerMessage,
                victories: newRoundData.victories
            });
        });

        socket.on('endGame', (finalData) => {
            this.setState({
                score: finalData.score,
                doubleButtonAlertMessage: finalData.winnerMessage,
                victories: finalData.victories
            });
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
                updatedData.newSittingPlayers[i] = boardDataResponseJSON.players[i];
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
            socket.emit('sitDown', this.room, this.props.location.state.username, seat);
        }
    }

    getUp(seat) {
        this.setState({ amISitting: false, mySeat: null });
        socket.emit('getUp', this.room, this.props.location.state.username, seat);
    }

    passLeaderPrivileges(newLeader) {
        socket.emit('passLeaderPrivileges', this.room, newLeader);
    }

    kickPlayer(player, seat) {
        socket.emit('kickPlayer', this.room, player, seat);
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
        const newGameType = e.target.value;
        socket.emit('changeGameType', this.room, newGameType);
    }

    startGame() {
        const readiness = this.checkSeats();

        if (readiness)
            socket.emit('startGame', this.room);
        else
            this.showAlert('Brak wymaganej ilości graczy!')
    }

    sendChatboxMessage(message) {
        socket.emit('sendChatboxMessage', this.room, this.props.location.state.username, message);
    }

    checkSeats() {
        for (let i = 0; i < this.state.playersNumber; i++)
            if (this.state.sittingPlayers[i] === 'Wolne miejsce')
                return false;

        return true;
    }

    addPoints(pointsIndex) {
        socket.emit('addPoints', this.room, pointsIndex);
    }

    restartGame() {
        this.setState({ doubleButtonAlertMessage: '' });
        socket.emit('startGame', this.room);
    }

    quitGame() {
        this.props.history.replace('/');
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
        socket.off('startGame');
        socket.off('endRound');
        socket.off('endGame');
    }

    render() {
        return (
            <div className={gameStyle.container} >
                <Table
                    mySeat={this.state.mySeat}
                    proposedValues={this.state.proposedValues}
                    score={this.state.score}
                    activePlayer={this.state.activePlayer}
                    addPoints={this.addPoints}
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
                    kickPlayer={this.kickPlayer}
                    startGame={this.startGame}
                    handleDeleteBoard={this.handleDeleteBoard}
                    sendChatboxMessage={this.sendChatboxMessage}
                />
                {
                    this.state.alertMessage &&
                    <Alert text={this.state.alertMessage} cancel={() => this.setState({ alertMessage: '' })} />
                }
                {
                    this.state.doubleButtonAlertMessage &&
                    <DoubleButtonAlert
                        text={this.state.doubleButtonAlertMessage}
                        button1='Rewanż'
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