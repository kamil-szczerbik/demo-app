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
            passwordConfirmation: "",

            errors: {
                email: '',
                username: '',
                password: '',
                passwordConfirmation: ''
            },

            register: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    //Walidacja + ewentualne wysłanie formularza do walidacji na serwerze.
    //Email waliduje tylko po @ i ., bo wykryje sporo przypadków próby oszukania systemu, a resztą zajmie się serwer (Tylko czy to jest dobre podejście? Teoretycznie bardziej obciąża serwer).
    //Walidacja emaila to w ogóle bardzo ciekawa sprawa -> fajny wątek https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    async handleSubmit(e) {
        e.preventDefault();

        let isError = false;
        const newErrors = {
            email: '',
            username: '',
            password: '',
            passwordConfirmation: ''
        }

        if (this.state.email === '')
            newErrors.email = 'Nie podano adresu email';
        else if (this.state.email.indexOf('@') < 1 || this.state.email.indexOf('.') < 1)
            newErrors.email = 'To nie jest adres email';

        if (this.state.username === '')
            newErrors.username = 'Nie podano nazwy użytkownika';
        else if (this.state.username.length < 4 || this.state.username.length > 14)
            newErrors.username = 'Nazwa użytkownika musi mieć od 4 do 14 znaków';

        if (this.state.password === '')
            newErrors.password = 'Nie podano hasła';
        else if (this.state.password.length < 8 || this.state.password.length > 30)
            newErrors.password = 'Hasło musi się składać z przynajmniej 8 znaków';
        else if (!this.state.password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/))
            newErrors.password = 'Hasło musi zawierać małą i wielką literę oraz cyfrę';

        if (this.state.passwordConfirmation === '')
            newErrors.passwordConfirmation = 'Potwierdź hasło';
        else if (this.state.passwordConfirmation !== this.state.password)
            newErrors.passwordConfirmation = 'Podane hasła nie są takie same';

        for (let i in newErrors) {
            if (newErrors[i] !== '')
                isError = true;
        }

        if (isError) {
            this.setState({ errors: newErrors });
        }
        else {
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
                        passwordConfirmation: this.state.passwordConfirmation
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
                        passwordConfirmation: ''
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
                                    value={this.state.password}
                                    onChange={this.handleInput}
                                />
                                <span className={formStyle.error}>{this.state.errors.password}</span>


                                <label htmlFor="passwordConfirmation">Powtórz hasło:</label><br />
                                <input
                                    className={formStyle.input}
                                    type="password"
                                    id="passwordConfirmation"
                                    name="passwordConfirmation"
                                    value={this.state.passwordConfirmation}
                                    onChange={this.handleInput}
                                />
                                <span className={formStyle.error}>{this.state.errors.passwordConfirmation}</span>

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