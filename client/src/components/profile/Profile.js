import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Header from '../Header';
import BackButton from '../buttons/BackButton';
import SaveButton from '../buttons/SaveButton';
import CancelButton from '../buttons/CancelButton';
import Alert from '../alerts/Alert';
import UserData from './UserData';
import Footer from '../Footer';
import * as authentication from '../../nonUI/authenticateUser';
import * as validation from '../../nonUI/validation';
import profileStyle from '../../css/profile.module.css';
import UserDataForm from './UserDataForm';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iduser: '',
            username: '',
            email: '',
            name: '',
            gender: '',
            birthdate: '',
            aboutme: '',
            createdat: '',

            newUsername: '',
            newEmail: '',
            newPassword: '',
            newPasswordConfirmation: '',
            newName: '',
            newGender: '',
            newBirthdate: '',
            newAboutme: '',

            errors: {},
            showForms: false,
            alertMessage: ''
        };

        this.newErrors = {};

        this.handleInput = this.handleInput.bind(this);
        this.handleData = this.handleData.bind(this);
        this.hideForms = this.hideForms.bind(this);
    }

    componentDidMount() {
        this.authenticateUser();
    }

    async authenticateUser() {
        const response = await authentication.authenticateUser();

        if (response.status === 200)
            this.tryGetUserData();
        else
            this.props.history.replace({
                pathname: '/'
            });
    }

    tryGetUserData() {
        try {
            this.getUserData();
        }
        catch (err) {
            console.log('Coś poszło nie tak ' + err);
        }
    }

    async getUserData() {
        const response = await fetch('/api/getUserData', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 200) {
            const responseJSON = await response.json();
            this.showUserData(responseJSON);
        }
        else
            console.log('nie ok'); //<--- obsłużyć
    }

    showUserData(userData) {
        this.setState({
            iduser: userData.iduser,
            username: userData.username,
            email: userData.email,
            name: userData.name,
            gender: userData.gender,
            birthdate: userData.birthdate,
            aboutme: userData.aboutme,
            createdat: userData.createdat,

            newUsername: userData.username,
            newEmail: userData.email,
            newPassword: '********',
            newPasswordConfirmation: '********',
            newName: userData.name,
            newGender: userData.gender,
            newBirthdate: userData.birthdate,
            newAboutme: userData.aboutme
        });
    }

    handleInput(e) {
        const newState = {};
        newState[e.target.name] = e.target.value;
        this.setState(newState);
    }

    handleData() {
        const forServer = { 'iduser': this.state.iduser };

        //co z nielogicznymi buttonami
        //zapis danych w bazie musi odświeżać state forma i state danych
        //przemyśleć walidację
        //co z walidacją przekleństw i znaków specjalnych (musi być baza ograniczona znaków regex?)?
        //jak z potwierdzeniem hasła?

        //czy nie da się prościej tego obiektu zmajstrować
        //czy ten obiekt ifować? (forServer)
        //czy na pewno w przypadku nieobowiązkowych danych poniższy if zadziała? (raczej tak)

        if (this.state.username !== this.state.newUsername) {
            this.newErrors.username = validation.checkUsername(this.state.newUsername);
            forServer['username'] = this.state.newUsername;
        }

        if (this.state.email !== this.state.newEmail) {
            this.newErrors.email = validation.checkEmail(this.state.newEmail);
            forServer['email'] = this.state.newEmail;
        }

        if (this.state.newPassword !== '********') {
            this.newErrors.password = validation.checkPassword(this.state.newPassword);
            forServer['password'] = this.state.newPassword;
        }

        if (this.state.newPasswordConfirmation !== '********') {
            this.newErrors.passwordConfirmation = validation.checkPasswordConfirmation(this.state.newPasswordConfirmation);
            forServer['passwordConfirmation'] = this.state.newPasswordConfirmation;
        }

        if (this.state.name !== this.state.newName) {
            this.newErrors.name = validation.checkName(this.state.newName);
            forServer['name'] = this.state.newName;
        }

        if (this.state.aboutme !== this.state.newAboutme) {
            this.newErrors.aboutme = validation.checkName(this.state.newAboutme);
            forServer['aboutme'] = this.state.newAboutme;
        }

        console.log(forServer);

        const isError = this.checkErrors();

        if (isError)
            this.showErrors();
        else if (Object.keys(forServer).length === 0)
            return;
        else
            this.tryValidateFormOnServer(forServer);
    }

    checkErrors() {
        for (let i in this.newErrors)
            if (this.newErrors[i] !== '')
                return true;

        return false;
    }

    showErrors() {
        this.setState({ errors: this.newErrors });
        console.log(this.newErrors);
    }

    tryValidateFormOnServer(forServer) {
        try {
            this.validateFormOnServer(forServer);
        }
        catch (err) {
            console.log('Coś poszło nie tak: ' + err);
        }
    }

    async validateFormOnServer(forServer) {
        console.log('123');

        const response = await fetch('/api/changeUserData', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(forServer)
        });

/*        if (response.status === 201)
            this.props.hideForm('Konto zostało pomyślnie zarejestrowane.');
        else
            this.handleServerErrors(response);*/
    }

    hideForms() {
        this.newErrors = {};

        this.setState({
            showForms: false,
            newUsername: this.state.username,
            newEmail: this.state.email,
            newPassword: '********',
            newPasswordConfirmation: '********',
            newName: this.state.name,
            newGender: this.state.gender,
            newBirthdate: this.state.birthdate,
            newAboutme: this.state.aboutme,
            errors: {}
        });
    }

    render() {
        return (
            <>
                <Header />

                <div className={profileStyle.userHeader}>
                    <BackButton />
                
                    <div
                        className={profileStyle.avatarContainer}
                        onClick={() => { this.setState({alertMessage: 'Wkrótce :)'})}}
                    >
                        <img src='/placeholders/avatar.jpg' alt='Awatar użytkownika' />
                        <div>
                            <span>zmień<br />avatar</span>
                        </div>
                    </div>
                
                    <div className={profileStyle.usernameBox}>
                        <h1>{this.state.username}</h1>
                    </div>
                </div>

                {
                    this.state.showForms
                        ?
                        <UserDataForm
                        username={this.state.newUsername}
                        email={this.state.newEmail}
                        password={this.state.newPassword}
                        passwordConfirmation={this.state.newPasswordConfirmation}
                        name={this.state.newName}
                        gender={this.state.newGender}
                        birthdate={this.state.newBirthdate}
                        aboutme={this.state.newAboutme}
                        errors={this.state.errors}
                        handleInput={this.handleInput}
                        />
                        :
                        <UserData
                        username={this.state.username}
                        email={this.state.email}
                        name={this.state.name}
                        gender={this.state.gender}
                        birthdate={this.state.birthdate}
                        aboutme={this.state.aboutme}
                        createdat={this.state.createdat}
                        />
                }
                
                <div className={profileStyle.userFooter}>

                    <div className={profileStyle.dataChangeButton} onClick={() => { this.setState({ /*showForms: true*/ alertMessage: 'Wkrótce :)' }) }}>
                        <h1>Zmień dane</h1>
                    </div>

                    <SaveButton handleData={this.handleData}/>
                    <CancelButton hideForms={this.hideForms}/>
                    
                </div>

                {
                    this.state.alertMessage &&
                    <Alert text={this.state.alertMessage} cancel={() => this.setState({ alertMessage: '' })} />
                }

                <Footer />
            </>
        );
    }
}

export default withRouter(Profile);