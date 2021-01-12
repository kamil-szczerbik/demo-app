import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Alert from '../alerts/Alert';
import * as authentication from '../../nonUI/authMe';
import socket from '../../nonUI/socketIO';
import boardStyle from '../../css/board.module.css';

class NewBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertMessage: ''
        };
        this.handleCreatingBoard = this.handleCreatingBoard.bind(this);
    }

    async handleCreatingBoard() {
        const authenticationResponse = await authentication.authMe(); // ← zmienić authMe na authenticateUser (wszędzie trzeba)

        if (authenticationResponse.status === 200) {
            this.tryCreateBoard(authenticationResponse);
        }
        else
            this.showAlert('Aby utworzyć stół, musisz być zalogowany.');
    }

    async tryCreateBoard(authenticationResponse) {
        const authenticationResponseJSON = await authenticationResponse.json();

        try {
            this.createBoard(authenticationResponseJSON);
        }
        catch (err) {
            console.log('Coś poszło nie tak: ' + err);
        }
    }

    async createBoard(authenticationResponseJSON) {
        const newBoardResponse = await fetch('/api/newBoard', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            game: 'dices', //póki co z tego nie korzystam, bo mam jedną grę
            leader: authenticationResponseJSON.username
        })
        });

        if (newBoardResponse.status === 200)
            this.joinNewBoard(newBoardResponse);
        else
            this.showAlert('Coś poszło nie tak. Spróbuj ponownie.');
    }

    async joinNewBoard(newBoardResponse) {
        const newBoardResponseJSON = await newBoardResponse.json();

        this.emitSockets(newBoardResponseJSON);
        this.redirectUser(newBoardResponseJSON);
    }

    emitSockets(newBoardResponseJSON) {
        socket.emit('joinBoard', newBoardResponseJSON.id, newBoardResponseJSON.leader);
        socket.emit('updateBoardsList');
    }

    redirectUser(newBoardResponseJSON) {
        this.props.history.push({
            pathname: 'kosci/s/' + newBoardResponseJSON.id,
            state: {
                boardId: newBoardResponseJSON.id,
                username: newBoardResponseJSON.leader
            }
        });
    }

    showAlert(message) {
        this.setState({ alertMessage: message });
    }

    render() {
        return (
            <>
                <div className={boardStyle.newBoard}>
                    <h1 className={boardStyle.title} onClick={this.handleCreatingBoard}>Załóż nowy stół</h1>
                </div>
                {
                    this.state.alertMessage &&
                    <Alert text={this.state.alertMessage} cancel={() => this.setState({ alertMessage: '' })} />
                }
            </>
        );
    }
}

export default withRouter(NewBoard);