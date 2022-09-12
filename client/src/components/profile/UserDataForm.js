import React, { Component } from 'react';
import profileStyle from '../../css/profile.module.css';

class UserDataForm extends Component {
    render() {
        return (
            <div className={profileStyle.infoContainer}>
                <div className={profileStyle.infoLeftSide}>
                    <label form="userData" htmlFor="newUsername">Nazwa użytkownika:</label>
                    <label form="userData" htmlFor="newEmail">Email:</label>
                    <label form="userData" htmlFor="newPassword">Hasło:</label>
                    <label form="userData" htmlFor="newPasswordConfirmation">Potwierdź hasło:</label>
                    <label form="userData" htmlFor="newName">Imię:</label>
                    <label form="userData" htmlFor="newGender">Płeć:</label>
                    <label form="userData" htmlFor="newBirthdate">Data urodzenia:</label>
                    <label form="userData" htmlFor="newAboutme">O mnie:</label>
                </div>
                
                <form className={profileStyle.userDataForm} id="userData">
                    <input
                        type="text"
                        name="newUsername"
                        id="newUsername"
                        value={this.props.username}
                        onChange={this.props.handleInput}
                    />
                    <span className={profileStyle.error}>{this.props.errors.username}</span>
                
                    <input
                        type="text"
                        name="newEmail"
                        id="newEmail"
                        value={this.props.email}
                        onChange={this.props.handleInput}
                    />
                    <span className={profileStyle.error}>{this.props.errors.email}</span>

                    <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={this.props.password}
                        onChange={this.props.handleInput}
                    />
                    <span className={profileStyle.error}>{this.props.errors.password}</span>

                    <input
                        type="password"
                        name="newPasswordConfirmation"
                        id="newPasswordConfirmation"
                        value={this.props.passwordConfirmation}
                        onChange={this.props.handleInput}
                    />
                    <span className={profileStyle.error}>{this.props.errors.passwordConfirmation}</span>

                    <input
                        type="text"
                        name="newName"
                        id="newName"
                        value={this.props.name}
                        onChange={this.props.handleInput}
                    />
                    <span className={profileStyle.error}>{this.props.errors.name}</span>

                    <select
                        name="newGender"
                        id="newGender"
                        value={this.props.gender}
                        onChange={this.props.handleInput}
                    >
                        <option value=""></option>
                        <option value="F">Kobieta</option>
                        <option value="M">Mężczyzna</option>
                        <option value="O">Inna</option>
                    </select>
                    <span className={profileStyle.error}>{this.props.errors.gender}</span>
                
                
                    <input
                        type="date"
                        name="newBirthdate"
                        id="newBirthdate"
                        value={this.props.birthdate}
                        onChange={this.props.handleInput}
                    />
                    <span className={profileStyle.error}>{this.props.errors.birthdate}</span>
                
                    <textarea
                        name="newAboutme"
                        id="newAboutme"
                        maxLength="255"
                        value={this.props.aboutme}
                        onChange={this.props.handleInput}
                    />
                    <span className={profileStyle.error}>{this.props.errors.aboutme}</span>

                </form>
            </div>
        );
    }
}

export default UserDataForm;