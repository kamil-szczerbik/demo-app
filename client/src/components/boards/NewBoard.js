import React, { Component } from 'react';
import Alert from '../alerts/Alert';
import { withRouter } from 'react-router-dom';
import boardStyle from '../../css/board.module.css';
import * as auth from '../../nonUI/authMe';
import socket from '../../nonUI/socketIO';


class NewBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false
        };
        this.test = false;
        this.authMe = this.authMe.bind(this);
    }

    async authMe() {
        const res = await auth.authMe();

        if (res.status === 200) {
            const json = await res.json();

            const response = await fetch('/api/newBoard', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    game: 'dices', //póki co tylko to, na razie z tego nawet nie korzystam
                    creator: json.username //Żeby założyć grę, musimy być zalogowani. Po autentykacji wysyłamy username, żeby wiedzieć kto jest założycielem
                    //i tu mam wątpliwość, ponownie, czy to jest bezpieczne?
                })
            });
            const responseJSON = await response.json();
            if (response.status === 200) {
                socket.emit('joinBoard', responseJSON.id, res.username);
                socket.emit('updateBoardsList'); //to wysyła ping serwerowi, który odsyła wszystkim zaktualizowaną listę
                this.props.history.push({
                    pathname: 'kosci/s/' + responseJSON.id,
                    state: {
                        boardId: responseJSON.id,
                        username: responseJSON.creator
                    }
                });
            }
            else {
                console.log('Coś poszło nie tak');
            }
        }
        else {
            this.setState({ showAlert: true });
        }
    }

    render() {
        return (
            <>
                <div className={boardStyle.newBoard}>
                    <h1 className={boardStyle.title} onClick={this.authMe}>Załóż nowy stół</h1>
                </div>
                {
                this.state.showAlert === true &&
                    <Alert text='Aby utworzyć nowy stół musisz być zalogowany!' cancel={() => this.setState({ showAlert: false })} />
                }
            </>
        );
    }
}

export default withRouter(NewBoard);