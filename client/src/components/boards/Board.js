import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Alert from '../alerts/Alert';
import PasswordAlert from '../alerts/PasswordAlert';
import * as getUsername from '../../nonUI/getUsername';
import socket from '../../nonUI/socketIO';
import boardStyle from '../../css/board.module.css';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordError: '',
            alertMessage: '',
            showPasswordAlert: false
        };
        this.username = '';

        this.handleJoiningBoard = this.handleJoiningBoard.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
    }

    async handleJoiningBoard() {
        const response = await getUsername.getUsername();
        if (response.status === 200) {
            const responseJSON = await response.json();
            this.username = responseJSON.username;
            this.checkPermissions();
        }
        else
            this.showAlert('Coś poszło nie tak. Spróbuj ponownie.')
    }

    checkPermissions() {
        if (this.props.type === 'public' || this.username === this.props.leader)
            this.joinBoard();
        else
            this.setState({ showPasswordAlert: true });
    }

    joinBoard() {
        socket.emit('joinBoard', this.props.id, this.username);
        this.redirectUser();
    }

    redirectUser() {
        this.props.history.push({
            pathname: '/kosci/s/' + this.props.id,
            state: {
                boardId: this.props.id,
                username: this.username
            }
        });
    }

    checkPassword(password) {
        if (password === '')
            this.showPasswordError('Nie podano hasła');
        else
            this.tryValidatePasswordOnServer(password);
    }

    tryValidatePasswordOnServer(password) {
        try {
            this.ValidatePasswordOnServer(password);
        }
        catch (err) {
            this.showAlert('Coś poszło nie tak: ' + err);
        }
    }

    async ValidatePasswordOnServer(password) {
            const passwordConfirmationResponse = await fetch('/api/checkPassword', {
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

            if (passwordConfirmationResponse.status === 200) {
                this.setState({ showPasswordAlert: false });
                this.joinBoard();
            }
            else {
                const passwordConfirmationResponseTEXT = await passwordConfirmationResponse.text();
                this.showPasswordError(passwordConfirmationResponseTEXT);
            }
    }

    showPasswordError(error) {
        this.setState({ passwordError: error });
    }

    showAlert(message) {
        this.setState({ alertMessage: message });
    }

    render() {
        return (
            <>
                <div className={boardStyle.boardContainer}>

                    <div className={boardStyle.info}>
                        <h1>Stół #{this.props.id} - {this.props.leader}</h1>
                    </div>

                    {
                        this.props.type === 'public'
                            ?
                            <div className={boardStyle.unlock}>
                                <img src={'/placeholders/unlock.svg'} alt='ikona kłódki' />
                            </div>
                            :
                            <div className={boardStyle.lock}>
                                <img src={'/placeholders/lock.svg'} alt='ikona kłódki' />
                            </div>
                    }

                    <div className={boardStyle.enter} onClick={this.handleJoiningBoard}>
                        <img src={'/placeholders/enter.svg'} alt='symbol wejścia do gry' />
                    </div>

                </div>
                {
                    this.state.showPasswordAlert &&
                    <PasswordAlert error={this.state.passwordError} checkPassword={this.checkPassword} cancel={() => this.setState({passwordError: '', showPasswordAlert: false})}/>
                }
                {
                    this.state.alertMessage &&
                    <Alert text={this.state.alertMessage} cancel={() => this.setState({ alertMessage: '' })} />
                }
            </>
        );
    }
}

export default withRouter(Board);