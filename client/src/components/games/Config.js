import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import PlayerSeats from './PlayerSeats';
import Timer from './Timer';
import Tab from './Tab';
import GameOptions from './options/GameOptions';
import Chatbox from '../chatbox/Chatbox';
import socket from '../../nonUI/socketIO';
import configStyle from '../../css/config.module.css';

class Config extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showedTab: 'Chat',
            alerts: [
                {
                    id: 'alert-' + nanoid(),
                    username: false,
                    alert: 'Założono nowy stół'
                }
            ]
        }

        this.changeTab = this.changeTab.bind(this);
    }

    componentDidMount() {
        socket.on('chatboxAlert', (notification) => {
            const newNotification = {
                id: 'notification-' + nanoid(),
                username: false,
                alert: notification
            };

            this.setState({ alerts: [...this.state.alerts, newNotification] });
        });

        socket.on('chatboxMessage', (username, message) => {
            const newMessage = {
                id: 'message-' + nanoid(),
                username: username,
                alert: message
            };

            this.setState({ alerts: [...this.state.alerts, newMessage] });
        });
    }

    changeTab(name) {
        this.setState({ showedTab: name });
    }

    componentWillUnmount() {
        socket.off('chatboxAlert');
        socket.off('chatboxMessage');
    }

    render() {
        return (
            <div className={configStyle.divSettings}>
                <div className={configStyle.innerSettings}>

                    <PlayerSeats
                        username={this.props.username}
                        leader={this.props.leader}
                        started={this.props.started}
                        playersNumber={this.props.playersNumber}
                        disabled={false}
                        sittingPlayers={this.props.sittingPlayers}
                        amISitting={this.props.amISitting}
                        availableSeats={this.props.availableSeats}
                        sitDown={this.props.sitDown}
                        getUp={this.props.getUp}
                        passLeaderPrivileges={this.props.passLeaderPrivileges}
                        kickPlayer={this.props.kickPlayer}
                    />

                    <Timer />

                    <hr />

                    <div className={configStyle.tabs}>
                        <Tab name='Ustawienia' handleClick={this.changeTab} />
                        <Tab name='Chat' handleClick={this.changeTab} />
                    </div>                    

                    {this.state.showedTab === 'Chat'
                        ?
                        <Chatbox
                            alerts={this.state.alerts}
                            sendChatboxMessage={this.props.sendChatboxMessage}
                        />
                        :
                        <GameOptions
                            username={this.props.username}
                            leader={this.props.leader}
                            started={this.props.started}
                            playersNumber={this.props.playersNumber}
                            roundsNumber={this.props.roundsNumber}
                            gameType={this.props.gameType}
                            password={this.props.password}
                            handlePlayersNumber={this.props.handlePlayersNumber}
                            handleRoundsNumber={this.props.handleRoundsNumber}
                            handleGameType={this.props.handleGameType}
                            startGame={this.props.startGame}
                            handleDeleteBoard={this.props.handleDeleteBoard}
                        />
                    }

                </div>
                <p className={configStyle.testInfo}>
                    Twoja nazwa użytkownika: {this.props.username}<br />
                        ID stołu: {this.props.room}<br />
                        Założyciel stołu: {this.props.leader}<br />
                        Zwycięsta: {this.props.victories}<br />
                </p>
            </div>
        );
    }
}

export default Config;