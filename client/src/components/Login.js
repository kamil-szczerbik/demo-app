//Komponent, który jest formularzem logowania

import React, { Component } from 'react';
import formStyle from '../css/form.module.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            username: "",
            password: "",
            rememberMe: false,

            usernameErr: "", //to jest po to, żeby odstęp był równy
            passwordErr: "",

            login: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ usernameErr: '' });
        let status;

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            })
        })
            .then(response => {
                status = response.status;
                return response.text();
            })
            .then((response) => {
                if (status === 200) {
                    const isRemembered = this.state.rememberMe;
                    this.props.login(isRemembered);
                    this.props.cancel();
                }
                else {
                    this.setState({ passwordErr: response });
                }
            })
            .catch(err => console.log(err));
    }

    handleInput(e) {
        const newState = {};
        newState[e.target.name] = e.target.value;
        this.setState(newState);
    }

    handleCheckbox(e) {
        const newState = {}
        newState[e.target.name] = e.target.checked;
        this.setState(newState);
    }

    render() {
        return (
            <div className={formStyle.divFixed}>
                <div className={formStyle.divForm}>
                    <form onSubmit={this.handleSubmit} className={formStyle.form}>

                        <label htmlFor="username">Nazwa użytkownika:</label><br />
                        <input
                            className={formStyle.input}
                            type="text"
                            id="username"
                            name="username"
                            required
                            value={this.state.username}
                            onChange={this.handleInput}
                        />
                        <span className={formStyle.error}>{this.state.usernameErr}</span> { /*do pokombinowania*/}

                        <label htmlFor="password">Hasło:</label><br />
                        <input
                            className={formStyle.input}
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={this.state.password}
                            onChange={this.handleInput}
                        />
                        <span className={formStyle.error}>{this.state.passwordErr}</span>

                        <input
                            className={formStyle.checkbox}
                            type='checkbox'
                            id='rememberMe'
                            name='rememberMe'
                            value={this.state.rememberMe}
                            onChange={this.handleCheckbox}
                        />
                        <label htmlFor='rememberMe' className={formStyle.checkboxLabel}>Zapamiętaj mnie</label>

                        <input className={formStyle.submit} type="submit" value="Login" />
                        <input className={formStyle.cancel} type="button" value="Cancel" onClick={this.props.cancel} />
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;