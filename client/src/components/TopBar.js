import React, { Component } from 'react';
import LoginForm from './forms/LoginForm';
import RegisterForm from './forms/RegisterForm';
import Alert from './alerts/Alert';
import * as auth from '../nonUI/authMe';
import * as logout from '../nonUI/logoutMe';
import globalStyle from '../css/global.module.css';

class TopBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginForm: false,
            registerForm: false,
            username: localStorage.getItem('username') || sessionStorage.getItem('username') || '',
            alertMessage: ''
        }

        this.showLoginForm = this.showLoginForm.bind(this);
        this.showRegisterForm = this.showRegisterForm.bind(this);
        this.hideForm = this.hideForm.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.setUsernameAndHideForm = this.setUsernameAndHideForm.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.showLogoutMessage = this.showLogoutMessage.bind(this);
    }

    showLoginForm() {
        this.setState({ loginForm: true, registerForm: false });
    }

    showRegisterForm() {
        this.setState({ loginForm: false, registerForm: true });
    }

    hideForm(message) {
    this.setState({ loginForm: false, registerForm: false, alertMessage: message });
    }

    async handleLogin(isRemembered) {
        const authenticationResponseJSON = await this.authenticateUser();
        this.addUsernameToStorage(authenticationResponseJSON.username, isRemembered);
        this.setUsernameAndHideForm(authenticationResponseJSON.username);
    }

    async authenticateUser() {
        const authenticationResponse = await auth.authMe();
        const authenticationResponseJSON = await authenticationResponse.json();
        return authenticationResponseJSON;
    }

    addUsernameToStorage(username, isRemembered) {
        if (isRemembered)
            localStorage.setItem('username', username);
        else
            sessionStorage.setItem('username', username);
    }

    setUsernameAndHideForm(username) {
        //Nie korzystam z hideForm(), żeby uniknąć podwójnej zmiany state (renderowania).
        this.setState({ username: username, loginForm: false, registerForm: false });
    }

    async handleLogout() {
        this.removeUsernameFromStorage();
        const logoutResponse = await logout.logoutMe();
        this.showLogoutMessage(logoutResponse);
    }

    removeUsernameFromStorage() {
        if (localStorage.getItem('username') !== null)
            localStorage.removeItem('username');

        else if (sessionStorage.getItem('username') !== null)
            sessionStorage.removeItem('username');
    } 

    showLogoutMessage(logoutResponse) {
        if (logoutResponse.status === 200)
            this.setState({ username: '', alertMessage: 'Zostałeś poprawnie wylogowany.' });
        else 
            this.setState({ alertMessage: 'Coś poszło nie tak. Spróbuj odświeżyć stronę.' });
    }

    render() {
        return (
            <div className={globalStyle.topBar}>
                <div className={globalStyle.left}>
                    <h1 className={globalStyle.siteName}>Nazwa</h1>
                </div>                
                <div className={globalStyle.right}>
                    {
                        this.state.username
                        ? 
                        <>
                            <span className={globalStyle.username}>Witaj {this.state.username}!</span>
                            <span className={globalStyle.options} onClick={this.handleLogout}>Logout</span>
                        </>
                        :
                        <>
                            <span className={globalStyle.options} onClick={this.showLoginForm}>Login</span>
                            <span className={globalStyle.options} onClick={this.showRegisterForm}>Register</span>
                        </>
                        }
                </div>

                {
                    this.state.loginForm &&
                    <LoginForm loginUser={this.handleLogin} hideForm={this.hideForm}/>
                }
                {
                    this.state.registerForm &&
                    <RegisterForm hideForm={this.hideForm} />
                }
                {
                    this.state.alertMessage &&
                    <Alert text={this.state.alertMessage} cancel={() => this.setState({ alertMessage: '' })} />
                }
            </div>
            );
    }
}

export default TopBar;