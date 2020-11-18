import React, { Component } from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';
import PasswordAlert from '../alerts/PasswordAlert';
import * as auth from '../../nonUI/authMe';
import socket from '../../nonUI/socketIO';
import boardStyle from '../../css/board.module.css';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardId: '',
            username: '',
            creator: '',
            error: '',
            showPasswordAlert: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.joinBoard = this.joinBoard.bind(this);
        /* <---- wychodzi na to, że w ramach jednej klasy nie trzeba jednak bindować? Trzeba jeśli używami this! Bo bez
        bindingu this jest brany jako this tej funkcji a nie klasy LOL*/

    }

    handleClick() {
        if (this.props.type === 'public') {
            this.joinBoard();
        }
        else {
            this.setState({ showPasswordAlert: true });
        }
    }

    async checkPassword(e, password) {
        e.preventDefault();
        try {
            const response = await fetch('/api/checkPassword', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: this.props.id,
                    password: password
                })
            });

            if (response.status === 200) {
                this.setState({ showPasswordAlert: false });
                this.joinBoard();
            }
            else {
                const responseTEXT = await response.text();
                this.setState({ error: responseTEXT });
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    async joinBoard() {
        let username;
        const res = await auth.authMe();
        if (res.status === 200) {
            username = res.username;
        }
        else {
            username = '#RND!lalala'
        }
        socket.emit('joinBoard', this.props.id, username);
        this.setState({
            boardId: this.props.id,
            username: username,
            creator: this.props.creator
        });
    }

    render() {
        return (
            <>
            <div className={boardStyle.board} onClick={this.handleClick}>
                    <h1>{this.props.id}</h1>
                    <img src={`/placeholders/${this.props.type === 'public' ? 'unlock' : 'lock'}.png`} alt='ikona kłódki' />
                    <h1>{this.props.creator}</h1>
                {
                    this.state.boardId !== '' &&
                    <Redirect to={{
                        pathname: '/kosci/s/' + this.state.boardId,
                        state: {
                            username: this.state.username,
                            boardId: this.state.boardId, //to robi za id pokoju tylko czy to jest bezpieczne? Czy nie będzie się dało tej wartości zmodyfikować
                            creator: this.state.creator
                            //i popsuć inne boardy?
                        } //Wysyłam coś do kompenentu, na który jestem redirectowany. Username będzie dostępny
                        //via this.props.location.state.username w komponencie Game
                    }}
                    />
                }
            </div>
                {
                    this.state.showPasswordAlert === true &&
                        <PasswordAlert error={this.state.error} checkPassword={this.checkPassword} cancel={() => this.setState({error: '', showPasswordAlert: false})}/>
                }
            </>
        );
    }
}

export default Board;