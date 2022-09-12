import React, { Component } from 'react';
import * as validation from '../../nonUI/validation';
import formStyle from '../../css/form.module.css';

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            errors: {}
        };

        this.newErrors = {};
        this.usernameInput = React.createRef(); //focus na username

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

    handleForm(e) {
        e.preventDefault();

        this.newErrors.username = validation.checkUsername(this.state.username);
        this.newErrors.email = validation.checkEmail(this.state.email);
        this.newErrors.password = validation.checkPassword(this.state.password);
        this.newErrors.passwordConfirmation = validation.checkPasswordConfirmation(this.state.password, this.state.passwordConfirmation);
        const isError = this.checkErrors();

        if (isError)
            this.showErrors();
        else
            this.tryValidateFormOnServer();
    }

    checkErrors() {
        for (let i in this.newErrors)
            if (this.newErrors[i])
                return true;

        return false;
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
        const response = await fetch('/api/register', {
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

        if (response.status === 201)
            this.props.hideForm('Konto zostało pomyślnie zarejestrowane.');
        else
            this.handleServerErrors(response);
    }

    async handleServerErrors(response) {
        const responseJSON = await response.json();

        console.log(this.newErrors);


        for (let i in responseJSON.errors)
            this.newErrors[i] = responseJSON.errors[i].msg;

        console.log(this.newErrors);
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