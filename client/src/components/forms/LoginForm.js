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
            rememberUser: false            
        };

        this.newErrors = {
            username: '',
            password: '',
        }

        this.usernameInput = React.createRef();

        this.handleInput = this.handleInput.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
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

    handleCheckbox(e) {
        const newState = {}
        newState[e.target.name] = e.target.checked;
        this.setState(newState);
    }

    handleForm(e) {
        e.preventDefault();
        this.newErrors.username = this.checkUsername();
        this.newErrors.password = this.checkPassword();
        const isError = this.checkErrors();

        if (isError)
            this.showErrors();
        else
            this.tryLogin();
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
        if (this.newErrors.username !== '' || this.newErrors.password !== '')
            return true;
        else
            return false;
    }

    showErrors() {
        this.setState({ errors: this.newErrors });
    }

    tryLogin() {
        try {
            this.login()
        }
        catch (err) {
            console.log('Coś poszło nie tak: ' + err);
        }
    }

    async login() {
        const loginResponse = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                rememberUser: this.state.rememberUser
            })
        });

        if (loginResponse.status === 200)
            this.props.showUserHeader(this.state.username);
        else
            this.loadServerErrors(loginResponse);
    }

    async loadServerErrors(loginResponse) {
        const loginResponseJSON = await loginResponse.json();

        for (let i in this.newErrors)
            this.newErrors[i] = '';

        for (let i in loginResponseJSON.errors)
            this.newErrors[i] = loginResponseJSON.errors[i].msg;

        this.showErrors();
    }

    render() {
        return (
            <div className={formStyle.divFixed}>
                <div className={formStyle.divForm}>
                    <form
                        className={formStyle.form}
                        onSubmit={this.handleForm}>

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
                            id='rememberUser'
                            name='rememberUser'
                            value={this.state.rememberUser}
                            onChange={this.handleCheckbox}
                        />
                        <label htmlFor='rememberUser' className={formStyle.checkboxLabel}>Zapamiętaj mnie</label>

                        <input className={formStyle.submit} type="submit" value="Zaloguj" />
                        <input className={formStyle.cancel} type="button" value="Anuluj"   onClick={() => this.props.hideForm('')} />
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginForm;