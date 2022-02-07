import React, { Component } from 'react';
import formStyle from '../../css/form.module.css';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errors: {
                username: '',
                password: ''
            },
            userRemembered: false            
        };

        this.newErrors = {
            username: '',
            password: '',
        }

        this.handleInput = this.handleInput.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.handleForm = this.handleForm.bind(this);
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

    handleForm() {
        this.newErrors.username = this.checkUsername();
        this.newErrors.password = this.checkPassword();
        this.checkErrors();
    }

    checkUsername() {
        if (this.state.username === '')
            return 'Nie podano nazwy użytkownika';

        return '';
    }

    checkPassword() {
        if (this.state.password === '')
            return 'Nie podano hasła';

        return '';
    }

    checkErrors() {
        let isError = false;

        if (this.newErrors.username !== '' || this.newErrors.password !== '')
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
            this.validateFormOnServer()
        }
        catch (err) {
            console.log('Coś poszło nie tak: ' + err);
        }
    }

    async validateFormOnServer() {
        const formValidationResponse = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            })
        });

        if (formValidationResponse.status === 200)
            this.props.loginUser(this.state.userRemembered);
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
                    <form className={formStyle.form}>

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

                        <input
                            className={formStyle.checkbox}
                            type='checkbox'
                            id='userRemembered'
                            name='userRemembered'
                            value={this.state.rememberMe}
                            onChange={this.handleCheckbox}
                        />
                        <label htmlFor='userRemembered' className={formStyle.checkboxLabel}>Zapamiętaj mnie</label>

                        <input className={formStyle.submit} type="button" value="Zaloguj"  onClick={this.handleForm} />
                        <input className={formStyle.cancel} type="button" value="Anuluj"   onClick={() => this.props.hideForm('')} />
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginForm;