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

            errors: {
                email: '',
                username: '',
                password: '',
                passwordCheck: ''
            },

            register: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    async handleSubmit(e) {
        e.preventDefault();
        //walidacja po stronie klienta dobra
        if (e.target[2].value === e.target[3].value) {

            try {
                const response = await fetch('/api/register', {
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
                });

                if (response.status === 201) {
                    this.setState({ register: false });
                }
                else {
                    const json = await response.json();

                    const newErrors = {
                        email: '',
                        username: '',
                        password: '',
                        passwordCheck: ''
                    };

                    for (let i in json.errors) {
                        newErrors[i] = json.errors[i].msg;
                    }
                    this.setState({ errors: newErrors });
                }
            }
            catch (err) {
                console.log('Coś poszło nie tak: ' + err);
            }        
        }
        else {
            const newErrors = {
                email: '',
                username: '',
                password: '',
                passwordCheck: 'Podane hasła nie są takie same!'
            };

            this.setState({ errors: newErrors });
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
                                    type="text"
                                    id="email"
                                    name="email"
/*                                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                    required*/
                                    value={this.state.email}
                                    onChange={this.handleInput}
                                />
                                <span className={formStyle.error}>{this.state.errors.email}</span>


                                <label htmlFor="username">Nazwa użytkownika:</label><br />
                                <input
                                    className={formStyle.input}
                                    type="text"
                                    id="username"
                                    name="username"
/*                                    minLength="4"
                                    maxLength="14"
                                    required*/
                                    value={this.state.username}
                                    onChange={this.handleInput}
                                />
                                <span className={formStyle.error}>{this.state.errors.username}</span>


                                <label htmlFor="password">Hasło:</label><br />
                                <input
                                    className={formStyle.input}
                                    type="password"
                                    id="password"
                                    name="password"
/*                                    minLength="8"
                                    required*/
                                    value={this.state.password}
                                    onChange={this.handleInput}
                                />
                                <span className={formStyle.error}>{this.state.errors.password}</span>


                                <label htmlFor="passwordCheck">Powtórz hasło:</label><br />
                                <input
                                    className={formStyle.input}
                                    type="password"
                                    id="passwordCheck"
                                    name="passwordCheck"
/*                                    required*/
                                    value={this.state.passwordCheck}
                                    onChange={this.handleInput}
                                />
                                <span className={formStyle.error}>{this.state.errors.passwordCheck}</span>


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