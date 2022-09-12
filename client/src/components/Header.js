import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import LoginForm from './forms/LoginForm';
import RegisterForm from './forms/RegisterForm';
import Alert from './alerts/Alert';
import * as loggingout from '../nonUI/logoutUser';
import globalStyle from '../css/global.module.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginForm: false,
            registerForm: false,
            username: '',
            alertMessage: ''
        };

        this.showLoginForm = this.showLoginForm.bind(this);
        this.showRegisterForm = this.showRegisterForm.bind(this);
        this.hideForm = this.hideForm.bind(this);
        this.showUserHeader = this.showUserHeader.bind(this);
        this.showGuestHeader = this.showGuestHeader.bind(this);
        this.redirectProfile = this.redirectProfile.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        const username = Cookies.get('username');
        if (username)
            this.setState({ username: username });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.username !== this.props.username)
            this.showUserHeader(this.props.username);
    }

    showUserHeader(username) {
        this.setState({ loginForm: false, username: username });
    }

    showGuestHeader() {
        this.setState({ username: '', alertMessage: 'Zostałeś poprawnie wylogowany.' });
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

    redirectProfile() {
        this.props.history.push({
            pathname: '/profil'
        });
    }

    showAlert(message) {
        this.setState({ alertMessage: message });
    }

    async handleLogout() {
        const response = await loggingout.logoutUser();
        if (response.status === 200)
        {
            if (this.props.location.pathname !== '/profil')
                this.showGuestHeader();
            else
                this.props.history.replace({
                    pathname: '/'
                });
        }
        else
            this.setState({ alertMessage: 'Coś poszło nie tak. Spróbuj odświeżyć stronę.' });
    }

    render() {
        return (
            <div className={globalStyle.header}>          
                    <h1 className={globalStyle.siteName}>Demo-app</h1>
                    {
                        this.state.username
                        ? 
                        <>
                            <p className={globalStyle.optionsWrapper}>
                                Witaj&nbsp;
                                <span className={globalStyle.options} onClick={this.redirectProfile}>{this.state.username}!</span>
                                <span className={globalStyle.options} onClick={this.handleLogout}>Wyloguj</span>
                            </p>
                           
                        </>
                        :
                        <>
                            <p className={globalStyle.optionsWrapper}>
                                <span className={globalStyle.options} onClick={this.showLoginForm}>Zaloguj</span>
                                <span className={globalStyle.options} onClick={this.showRegisterForm}>Zarejestruj</span>
                            </p>
                        </>
                        }
                {
                    this.state.loginForm &&
                    <LoginForm showUserHeader={this.showUserHeader} hideForm={this.hideForm}/>
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

export default withRouter(Header);