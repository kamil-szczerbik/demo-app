//Komponent będący konfiguracją gry kości (prawy panel)

import React, { Component } from 'react';
import PlayerBar from './PlayerBar';
import Alert from '../alerts/Alert';
import socket from '../../nonUI/socketIO';
import style from '../../css/style.module.css';

class Config extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPublic: false,
            password: '',
            message: '',
            showAlert: false
        }
        this.handleType = this.handleType.bind(this);
    }

    componentDidMount() {
        socket.on('getPassword', (newPassword) => {
            this.setState({password: newPassword})
        });

        if (this.props.creator === this.props.username)
            socket.emit('setGameType', this.props.room, false);
    }

    componentWillUnmount() {
        socket.off('getPassword');
    }

    handleType(e) {
        if (e.target.value === 'public') {
            socket.emit('setGameType', this.props.room, true);
            this.setState({ isPublic: true });
        }
        else {
            socket.emit('setGameType', this.props.room, false);
            this.setState({ isPublic: false });
        }
    }

    render() {
        return (
            <div className={style.divSettings}>
                <div className={style.innerSettings}>

                    <PlayerBar seat={0} path='/placeholders/avatar.jpg' started={this.props.started} disabled={false} player={this.props.players[0]} amISitting={this.props.amISitting} availableSeat={this.props.availableSeats[0]} sit={this.props.sit} getUp={this.props.getUp}/>
                    <PlayerBar seat={1} path='/placeholders/avatar.jpg' started={this.props.started} disabled={false} player={this.props.players[1]} amISitting={this.props.amISitting} availableSeat={this.props.availableSeats[1]} sit={this.props.sit} getUp={this.props.getUp}/>
                    <PlayerBar seat={2} path='/placeholders/avatar.jpg' started={this.props.started} disabled={this.props.playersNumber < 3 ? true : false} player={this.props.players[2]} amISitting={this.props.amISitting} availableSeat={this.props.availableSeats[2]} sit={this.props.sit} getUp={this.props.getUp}/>
                    <PlayerBar seat={3} path='/placeholders/avatar.jpg' started={this.props.started} disabled={this.props.playersNumber < 4 ? true : false} player={this.props.players[3]} amISitting={this.props.amISitting} availableSeat={this.props.availableSeats[3]} sit={this.props.sit} getUp={this.props.getUp}/>

                    <p>
                        Twoja nazwa użytkownika: {this.props.username}<br />
                        ID stołu: {this.props.room}<br />
                        Założyciel stołu: {this.props.creator}<br />
                    </p>

                    <form className={style.optionsPlayers} onSubmit={this.props.startGame}>
                        <fieldset disabled={this.props.started}>
                            <p>Liczba graczy:</p>
                                <input type='radio' id='players2' name='players' value='2' checked={this.props.playersNumber === 2} onChange={this.props.handlePlayersNumber} disabled={this.props.creator === this.props.username ? false : true} />
                                <label for='players2'>2</label>
                                <input type="radio" id='players3' name='players' value='3' checked={this.props.playersNumber === 3} onChange={this.props.handlePlayersNumber} disabled={this.props.creator === this.props.username ? false : true} />
                                <label for='players3'>3</label>
                                <input type="radio" id='players4' name='players' value='4' checked={this.props.playersNumber === 4} onChange={this.props.handlePlayersNumber} disabled={this.props.creator === this.props.username ? false : true} />
                                <label for='players4'>4</label>
                            <br />
                            <p>Rodzaj gry:</p>
                                <input type='radio' id='public' name='gameType' value='public' checked={this.state.isPublic} onChange={this.handleType} disabled={this.props.creator === this.props.username ? false : true} />
                                <label for='public'>publiczna</label>
                            
                                <input type='radio' id='private' name='gameType' value='private' checked={!this.state.isPublic} onChange={this.handleType} disabled={this.props.creator === this.props.username ? false : true} />
                                <label for='private'>prywatna</label>
                            {
                                this.state.isPublic === false &&
                                    <h2>{this.state.password}</h2>
                            }
                                <input className={style.startButton} type='submit' value='Start!' disabled={this.props.creator === this.props.username ? false : true} />
                        </fieldset>
                    </form>
                </div>
                {
                    this.state.showAlert === true &&
                        <Alert text={this.state.message} cancel={() => this.setState({showAlert: false})} />
                }
            </div>

        );
    }
}

export default Config;