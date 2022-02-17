import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import Alert from '../alerts/Alert';
import * as authentication from '../../nonUI/authenticateUser';
import socket from '../../nonUI/socketIO';
import boardStyle from '../../css/board.module.css';

class NewBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertMessage: ''
        };
        this.handleCreatingBoard = this.handleCreatingBoard.bind(this);
        this.redirectHome = this.redirectHome.bind(this);
    }

    async handleCreatingBoard() {
        const response = await authentication.authenticateUser();
        const username = Cookies.get('username');

        if (response.status === 200 && username)
            this.tryCreateBoard(username);
        else
            this.showAlert('Aby utworzyć stół, musisz być zalogowany.');
    }

    async tryCreateBoard(username) {
        try {
            this.createBoard(username);
        }
        catch (err) {
            console.log('Coś poszło nie tak: ' + err);
        }
    }

    async createBoard(username) {
        const newBoardResponse = await fetch('/api/newBoard', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            game: 'dices', //póki co z tego nie korzystam, bo mam jedną grę
            leader: username
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
        this.redirectNewBoard(newBoardResponseJSON);
    }

    emitSockets(newBoardResponseJSON) {
        socket.emit('joinBoard', newBoardResponseJSON.id, newBoardResponseJSON.leader);
        socket.emit('updateBoardsList');
    }

    redirectNewBoard(newBoardResponseJSON) {
        this.props.history.push({
            pathname: 'kosci/s/' + newBoardResponseJSON.id,
            state: {
                boardId: newBoardResponseJSON.id,
                username: newBoardResponseJSON.leader
            }
        });
    }

    redirectHome() {
        this.props.history.push({
            pathname: '/'
        });
    }

    showAlert(message) {
        this.setState({ alertMessage: message });
    }

    render() {
        return (
            <>
                <div className={boardStyle.newBoardContainer}>
                    <div className={boardStyle.back} onClick={this.redirectHome}>
                        <img src={'/placeholders/back.svg'} alt='symbol powrotu na stronę główną'/>
                    </div>
                    <div className={boardStyle.newBoard}>
                        <h1 onClick={this.handleCreatingBoard}>Załóż nowy stół</h1>
                    </div>
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