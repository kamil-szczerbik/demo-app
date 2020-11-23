//Komponent będący konfiguracją gry kości (prawy panel)

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PlayerBar from './PlayerBar';
import Alert from '../alerts/Alert';
import DoubleButtonAlert from '../alerts/DoubleButtonAlert';
import socket from '../../nonUI/socketIO';
import style from '../../css/style.module.css';

class Config extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            remainedTime: '',
            showAlert: false,
            showDoubleButtonAlert: false,
            text: ''
        }
        this.handleDeleteBoard = this.handleDeleteBoard.bind(this);
    }

    componentDidMount() {
        socket.on('kickOthers', () => {
            this.setState({ text: 'Założyciel rozwiązał stół. Kliknij aby wrócić do strony głownej.' });
        });

        socket.on('timeHasEnded', () => {
            this.setState({ text: 'Niestety, dozwolony czas rozgrywki upłynął. Kliknij, aby wrócić do strony głownej.' });
        });

        socket.on('countDown', (newRemainedTime) => {
            this.setState({ remainedTime: newRemainedTime });
        });
    }

    componentWillUnmount() {
        socket.off('kickOthers');
        socket.off('countDown');
    }

    async handleDeleteBoard() {
        const room = this.props.room;

        const response = await fetch('/api/deleteBoard', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.props.room
            })
        });
        if (response.status === 200) {
            socket.emit('updateBoardsList');
            socket.emit('kickOthers', room);
            this.props.history.push('/');
            //Wykonuje się ComponentWillUnmount, więc socket off tu nie muszę umieszczać
        }
    }

    render() {
        return (
            <div className={style.divSettings}>
                <div className={style.innerSettings}>

                    <PlayerBar seat={0} path='/placeholders/avatar.jpg' username={this.props.username} creator={this.props.creator} started={this.props.started} disabled={false} player={this.props.players[0]} amISitting={this.props.amISitting} availableSeat={this.props.availableSeats[0]} sit={this.props.sit} getUp={this.props.getUp} handover={this.props.handover} kick={this.props.kick}/>
                    <PlayerBar seat={1} path='/placeholders/avatar.jpg' username={this.props.username} creator={this.props.creator} started={this.props.started} disabled={false} player={this.props.players[1]} amISitting={this.props.amISitting} availableSeat={this.props.availableSeats[1]} sit={this.props.sit} getUp={this.props.getUp} handover={this.props.handover} kick={this.props.kick}/>
                    <PlayerBar seat={2} path='/placeholders/avatar.jpg' username={this.props.username} creator={this.props.creator} started={this.props.started} disabled={this.props.playersNumber < 3 ? true : false} player={this.props.players[2]} amISitting={this.props.amISitting} availableSeat={this.props.availableSeats[2]} sit={this.props.sit} getUp={this.props.getUp} handover={this.props.handover} kick={this.props.kick}/>
                    <PlayerBar seat={3} path='/placeholders/avatar.jpg' username={this.props.username} creator={this.props.creator} started={this.props.started} disabled={this.props.playersNumber < 4 ? true : false} player={this.props.players[3]} amISitting={this.props.amISitting} availableSeat={this.props.availableSeats[3]} sit={this.props.sit} getUp={this.props.getUp} handover={this.props.handover} kick={this.props.kick}/>

                    <p>
                        Twoja nazwa użytkownika: {this.props.username}<br />
                        ID stołu: {this.props.room}<br />
                        Założyciel stołu: {this.props.creator}<br />
                        Pozostały czas: {this.state.remainedTime}
                    </p>

                    <form className={style.optionsPlayers} onSubmit={this.props.startGame}>
                        <fieldset disabled={this.props.started}>
                            <p>Liczba graczy:</p>
                                <input type='radio' id='players2' name='players' value='2' checked={this.props.playersNumber === 2} onChange={this.props.handlePlayersNumber} disabled={this.props.creator === this.props.username ? false : true} />
                                <label htmlFor='players2'>2</label>
                                <input type="radio" id='players3' name='players' value='3' checked={this.props.playersNumber === 3} onChange={this.props.handlePlayersNumber} disabled={this.props.creator === this.props.username ? false : true} />
                                <label htmlFor='players3'>3</label>
                                <input type="radio" id='players4' name='players' value='4' checked={this.props.playersNumber === 4} onChange={this.props.handlePlayersNumber} disabled={this.props.creator === this.props.username ? false : true} />
                                <label htmlFor='players4'>4</label>
                            <br />
                            <p>Rodzaj gry:</p>
                                <input type='radio' id='public' name='gameType' value='public' checked={this.props.type === 'public'} onChange={this.props.handleType} disabled={this.props.creator === this.props.username ? false : true} />
                                <label htmlFor='public'>publiczna</label>
                            
                                <input type='radio' id='private' name='gameType' value='private' checked={this.props.type === 'private'} onChange={this.props.handleType} disabled={this.props.creator === this.props.username ? false : true} />
                                <label htmlFor='private'>prywatna</label>
                            {
                                this.props.type === 'private' &&
                                    <h2>{this.props.password}</h2>
                            }
                                <input className={style.startButton} type='submit' value='Start!' disabled={this.props.creator === this.props.username ? false : true} />
                                <input className={style.startButton} type='button' value='Spal stół' disabled={this.props.creator === this.props.username ? false : true} onClick={() => this.setState({showDoubleButtonAlert: true})}/>
                        </fieldset>
                    </form>
                </div>
                {
                    this.state.showAlert === true &&
                        <Alert text={this.state.message} cancel={() => this.setState({showAlert: false})} />
                }
                {
                    this.state.showDoubleButtonAlert === true &&
                        <DoubleButtonAlert text='Czy na pewno chcesz usunąć ten stół?' button1='Tak' button2='Nie' handleButton1={this.handleDeleteBoard} handleButton2={() => this.setState({showDoubleButtonAlert: false})} />
                }
                {
                    this.state.text!== '' &&
                    <Alert text={this.state.text} cancel={() => this.props.history.push('/')} />
                }
            </div>

        );
    }
}

export default withRouter(Config);