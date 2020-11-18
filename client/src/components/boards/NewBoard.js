import React, { Component } from 'react';
import Game from '../games/Game';
import Alert from '../alerts/Alert';
import { BrowserRouter, Redirect } from 'react-router-dom';
import boardStyle from '../../css/board.module.css';
import * as auth from '../../nonUI/authMe';
import socket from '../../nonUI/socketIO';


class NewBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardId: '',
            username: '',
            creator: '',
            showAlert: false,
        }
        this.test = false;
        this.authMe = this.authMe.bind(this);
    }

    async authMe() {
        const res = await auth.authMe();
        if (res.status === 200) {
            const response = await fetch('/api/newBoard', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    game: 'dices', //póki co tylko to, na razie z tego nawet nie korzystam
                    creator: res.username //Żeby założyć grę, musimy być zalogowani. Po autentykacji wysyłamy username, żeby wiedzieć kto jest założycielem
                    //i tu mam wątpliwość, ponownie, czy to jest bezpieczne?
                })
            });
            const responseJSON = await response.json();

            if (response.status === 200) {
                socket.emit('joinBoard', responseJSON.id, res.username);
                socket.emit('updateBoardsList'); //to wysyła ping serwerowi, który odsyła wszystkim zaktualizowaną listę
                this.setState({
                    boardId: responseJSON.id,
                    username: res.username,
                    creator: responseJSON.creator
                });
            }
        }
        else {
            this.setState({ showAlert: true });
        }
    }

    render() {
        return (
            <div className={boardStyle.newBoard}>
                <h1 className={boardStyle.title} onClick={this.authMe}>Utwórz nowy stół</h1>
                {this.state.showAlert === true &&
                    <Alert text='Aby utworzyć nowy stół musisz być zalogowany!' cancel={() => this.setState({ showAlert: false })} />
                }
                {
                    this.state.boardId !== '' &&
                    <Redirect to={{
                        pathname: '/kosci/s/' + this.state.boardId,
                        state: {
                            username: this.state.username,
                            boardId: this.state.boardId, //to robi za id pokoju
                            creator: this.state.creator
                        } //Wysyłam coś do kompenentu, na który jestem redirectowany. Username będzie dostępny
                        //via this.props.location.state.username w komponencie Game
                    }}
                    />
                }
            </div>
        );
    }
}

export default NewBoard;