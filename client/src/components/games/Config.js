import React, { Component } from 'react';
import PlayerSeats from './PlayerSeats';
import Timer from './Timer';
import GameOptions from './options/GameOptions';
import Chatbox from './Chatbox';
import configStyle from '../../css/config.module.css';

class Config extends Component {
    constructor(props) {
        super(props);
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

                    <Chatbox />

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