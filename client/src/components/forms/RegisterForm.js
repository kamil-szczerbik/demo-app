import React, { Component } from 'react';
import formStyle from '../../css/form.module.css';

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',

            errors: {
                username: '',
                email: '',
                password: '',
                passwordConfirmation: ''
            }
        };

        this.newErrors = {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: ''
        }

        this.usernameInput = React.createRef();

        this.handleInput = this.handleInput.bind(this);
        this.handleForm = this.handleForm.bind(this);
    }

    componentDidMount() {
        this.usernameInput.current.focus();
    }

    handleInput(e) {
        const newState = {};
        newState[e.target.name] = e.target.value;
        this.setState(newState);
    }

    async handleForm(e) {
        e.preventDefault();

        this.newErrors.username = this.checkUsername();
        this.newErrors.email = this.checkEmail();
        this.newErrors.password = this.checkPassword();
        this.newErrors.passwordConfirmation = this.checkPasswordConfirmation();
        this.checkErrors();
    }

    checkUsername() {
        if (this.state.username === '')
            return 'Nie podano nazwy użytkownika';
        else if (this.state.username.length < 4 || this.state.username.length > 14)
            return 'Nazwa użytkownika musi mieć od 4 do 14 znaków';
        else
            return '';
    }

    //Dokładniejsza walidacja emaila na serwerze.
    //Ciekawy wątek o walidacji maili https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    checkEmail() {
        if (this.state.email === '')
            return 'Nie podano adresu email';
        else if (this.state.email.indexOf('@') < 1 || this.state.email.indexOf('.') < 1)
            return 'To nie jest adres email';
        else
            return '';
    }

    checkPassword() {
        if (this.state.password === '')
            return 'Nie podano hasła';
        else if (this.state.password.length < 8 || this.state.password.length > 30)
            return 'Hasło musi się składać z przynajmniej 8 znaków';
        else if (!this.state.password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/))
            return 'Hasło musi zawierać małą i wielką literę oraz cyfrę';
        else
            return '';
    }

    checkPasswordConfirmation() {
        if (this.state.passwordConfirmation === '')
            return 'Potwierdź hasło';
        else if (this.state.passwordConfirmation !== this.state.password)
            return 'Podane hasła nie są takie same';
        else
            return '';
    }

    checkErrors() {
        let isError = false;

        for (let i in this.newErrors)
            if (this.newErrors[i] !== '')
                isError = true;

        if (isError)
            this.showErrors();
        else
            this.tryValidateFormOnServer();
    }

    showErrors() {
        this.setState({ errors: this.newErrors });
    }

    tryValidateFormOnServer() {
        try {
            this.validateFormOnServer();
        }
        catch (err) {
            console.log('Coś poszło nie tak: ' + err);
        }
    }

    async validateFormOnServer() {
        const formValidationResponse = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
                passwordConfirmation: this.state.passwordConfirmation
            })
        });

        if (formValidationResponse.status === 201)
            this.props.hideForm('Konto zostało pomyślnie zarejestrowane.');
        else
            this.loadErrorsReceivedFromServer(formValidationResponse);
    }

    async loadErrorsReceivedFromServer(formValidationResponse) {
        const formValidationResponseJSON = await formValidationResponse.json();

        for (let i in this.newErrors)
            this.newErrors[i] = '';

        for (let i in formValidationResponseJSON.errors)
            this.newErrors[i] = formValidationResponseJSON.errors[i].msg;

        this.showErrors();
    }

    render() {
        return (
            <div className={formStyle.divFixed}>
                <div className={formStyle.divForm}>
                    <form className={formStyle.form} onSubmit={this.handleForm}>
                        <label htmlFor="username">Nazwa użytkownika:</label><br />
                        <input
                            className={formStyle.input}
                            type="text"
                            id="username"
                            name="username"
                            value={this.state.username}
                            ref={this.usernameInput}
                            onChange={this.handleInput}
                        />
                        <span className={formStyle.error}>{this.state.errors.username}</span>

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

                        <input className={formStyle.submit} type="submit" value="Zarejestruj" />
                        <input className={formStyle.cancel} type="button" value="Anuluj" onClick={() => this.props.hideForm('')} />
                    </form>
                </div>
            </div>
        );
    }
}

export default RegisterForm;