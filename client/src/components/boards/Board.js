import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PasswordAlert from '../alerts/PasswordAlert';
import * as auth from '../../nonUI/authMe';
import socket from '../../nonUI/socketIO';
import boardStyle from '../../css/board.module.css';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            showPasswordAlert: false
        }
        this.username = '';

        this.handleClick = this.handleClick.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.joinBoard = this.joinBoard.bind(this);
    }

    async handleClick() {
        const res = await auth.getUsername();

        if (res.status === 200) {
            const json = await res.json();
            this.username = json.username;

            if (this.props.type === 'public' || this.username === this.props.creator) {
                this.joinBoard();
            }
            else {
                this.setState({ showPasswordAlert: true });
            }
        }
        else {
            console.log('Coś poszło nie tak');
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

    joinBoard() {
        socket.emit('joinBoard', this.props.id, this.username);
        this.props.history.push({
            pathname: '/kosci/s/' + this.props.id,
            state: {
                boardId: this.props.id,
                username: this.username
            }
        });
    }

    render() {
        return (
            <>
            <div className={boardStyle.board} onClick={this.handleClick}>
                    <h1>{this.props.id}</h1>
                    <img src={`/placeholders/${this.props.type === 'public' ? 'unlock' : 'lock'}.png`} alt='ikona kłódki' />
                    <h1>{this.props.creator}</h1>
            </div>
                {
                    this.state.showPasswordAlert === true &&
                        <PasswordAlert error={this.state.error} checkPassword={this.checkPassword} cancel={() => this.setState({error: '', showPasswordAlert: false})}/>
                }
            </>
        );
    }
}

export default withRouter(Board);