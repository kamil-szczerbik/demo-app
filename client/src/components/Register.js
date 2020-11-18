//Komponent, który jest formularzem rejestracji

import React, { Component } from 'react';
import formStyle from '../css/form.module.css';
import Alert from './alerts/Alert';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            username: "",
            password: "",
            passwordCheck: "",

            emailErr: "",
            usernameErr: "",
            passwordErr: "",
            passwordCheckErr: "",

            register: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ passwordCheckErr: '' });
        this.setState({ emailErr: '' });
        this.setState({ usernameErr: '' });
        if (e.target[2].value === e.target[3].value) {
            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                    username: this.state.username,
                    password: this.state.password,
                })
            })
                .then(response => response.json())
                .then((response) => {
                    console.log(response);
                    if (response == 1) {
                        this.setState({ register: false });
                    }
                    else {
                        if (response[0]) {
                            this.setState({ emailErr: response[0] });
                        }
                        else {
                            this.setState({ emailErr: '' });
                        }
                        if (response[1]) {
                            this.setState({ usernameErr: response[1] });
                        }
                        else {
                            this.setState({ usernameErr: '' });
                        }
                    }
                })
                .catch(err => console.log(err));
        }
        else {
            this.setState({ passwordCheckErr: 'Podane hasła nie są takie same!' });
        }
    }

    handleInput(e) {
        const newState = {};
        newState[e.target.name] = e.target.value;
        this.setState(newState);
    }

    render() {
        return (
            <div className={formStyle.divFixed}>

                {
                    this.state.register === true
                        ?
                        <div className={formStyle.divForm}>
                            <form onSubmit={this.handleSubmit} className={formStyle.form}>

                                <label htmlFor="email">E-mail:</label><br />
                                <input
                                    className={formStyle.input}
                                    type="email"
                                    id="email"
                                    name="email"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                    required
                                    value={this.state.email}
                                    onChange={this.handleInput}
                                />
                                <span className={formStyle.error}>{this.state.emailErr}</span>


                                <label htmlFor="username">Nazwa użytkownika:</label><br />
                                <input
                                    className={formStyle.input}
                                    type="text"
                                    id="username"
                                    name="username"
                                    minLength="4"
                                    maxLength="16"
                                    required
                                    value={this.state.username}
                                    onChange={this.handleInput}
                                />
                                <span className={formStyle.error}>{this.state.usernameErr}</span>


                                <label htmlFor="password">Hasło:</label><br />
                                <input
                                    className={formStyle.input}
                                    type="password"
                                    id="password"
                                    name="password"
                                    minLength="8"
                                    required
                                    value={this.state.password}
                                    onChange={this.handleInput}
                                />
                                <span className={formStyle.error}>{this.state.passwordErr}</span>


                                <label htmlFor="passwordCheck">Powtórz hasło:</label><br />
                                <input
                                    className={formStyle.input}
                                    type="password"
                                    id="passwordCheck"
                                    name="passwordCheck"
                                    required
                                    value={this.state.passwordCheck}
                                    onChange={this.handleInput}
                                />
                                <span className={formStyle.error}>{this.state.passwordCheckErr}</span>


                                <input className={formStyle.submit} type="submit" value="Submit" />
                                <input className={formStyle.cancel} type="button" value="Cancel" onClick={this.props.cancel} />
                            </form>
                        </div>
                        :
                        <Alert cancel={this.props.cancel} text='Zostałeś pomyślnie zarejestrowany! Na Twój adres email została (tak naprawdę nie została) wysłana wiadomość z linkiem aktywującym konto.' />
                }

            </div>
        );
    }
}

export default Register;