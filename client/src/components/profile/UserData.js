import React, { Component } from 'react';
import profileStyle from '../../css/profile.module.css';

class UserData extends Component {
    render() {
        return (
            <div className={profileStyle.infoContainer}>
                <div className={profileStyle.infoLeftSide}>
                    <p>Nazwa użytkownika:</p>
                    <p>Email:</p>
                    <p>Hasło:</p>
                    <p>Imię:</p>
                    <p>Płeć:</p>
                    <p>Data urodzenia:</p>
                    <p>Data rejestracji:</p>
                    <p>O mnie:</p>
                </div>
                
                <div className={profileStyle.infoRightSide}>
                    <p>{this.props.username}</p>
                    <p>{this.props.email}</p>
                    <p>********</p>
                    <p>{this.props.name}</p>
                    <p>{this.props.gender}</p>
                    <p>{this.props.birthdate}</p>
                    <p>{this.props.createdat}</p>
                    <p>{this.props.aboutme}</p>
                </div>
            </div>
        );
    }
}

export default UserData;