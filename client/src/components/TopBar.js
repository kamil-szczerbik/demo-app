//Komponent, który jest belk¹ na górze strony, wywo³uj¹cy formularz logowanie i rejestracji, a tak¿e funkcjê wylogowuj¹c¹

import React, { Component } from 'react';
import Login from './Login';
import Register from './Register';
import * as auth from '../nonUI/authMe';
import * as logout from '../nonUI/logoutMe';
import globalStyle from '../css/global.module.css';

class TopBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginForm: false,
            registerForm: false,
            username: localStorage.getItem('username') || sessionStorage.getItem('username') || ''
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.cancelForm = this.cancelForm.bind(this);
        this.login = this.login.bind(this);
    }

    handleLogin() {
        this.setState({ loginForm: true, registerForm: false });
    }

    handleRegister() {
        this.setState({ loginForm: false, registerForm: true });
    }

    handleLogout() {
        if (localStorage.getItem('username') !== null) {
            localStorage.removeItem('username');
        }
        else if (sessionStorage.getItem('username') !== null) {
            sessionStorage.removeItem('username');
        }

        logout.logoutMe();
        this.setState({ username: '' });
    }

    cancelForm() {
        this.setState({ loginForm: false, registerForm: false });
    }

    async login(isRemembered) {
        const res = await auth.authMe();
        const resJson = await res.json();

        if (isRemembered) {
            localStorage.setItem('username', resJson.username);
        }
        else {
            sessionStorage.setItem('username', resJson.username);
        }

        this.setState({ username: resJson.username });
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
                            <span className={globalStyle.options} onClick={this.handleLogin}>Login</span>
                            <span className={globalStyle.options} onClick={this.handleRegister}>Register</span>
                        </>
                        }
                </div>

                {this.state.loginForm &&
                    <Login login={this.login} cancel={this.cancelForm} />
                }
                {this.state.registerForm &&
                    <Register cancel={this.cancelForm} />
                }
            </div>
            );
    }
}
export default TopBar;