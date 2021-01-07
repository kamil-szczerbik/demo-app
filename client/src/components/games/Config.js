import React, { Component } from 'react';
import PlayerSeats from './PlayerSeats';
import GameOptions from './options/GameOptions';
import Timer from './Timer';
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
                        creator={this.props.creator}
                        started={this.props.started}
                        playersNumber={this.props.playersNumber}
                        disabled={false}
                        players={this.props.players}
                        amISitting={this.props.amISitting}
                        availableSeats={this.props.availableSeats}
                        sit={this.props.sit}
                        getUp={this.props.getUp}
                        handover={this.props.handover}
                        kick={this.props.kick}
                    />

                    <Timer />

                    <hr />

                    <GameOptions
                        username={this.props.username}
                        creator={this.props.creator}
                        started={this.props.started}
                        playersNumber={this.props.playersNumber}
                        roundsNumber={this.props.roundsNumber}
                        type={this.props.type}
                        password={this.props.password}
                        handlePlayersNumber={this.props.handlePlayersNumber}
                        handleRoundsNumber={this.props.handleRoundsNumber}
                        handleType={this.props.handleType}
                        startGame={this.props.startGame}
                        handleDeleteBoard={this.props.handleDeleteBoard}
                    />
                </div>
                <p className={configStyle.testInfo}>
                    Twoja nazwa użytkownika: {this.props.username}<br />
                        ID stołu: {this.props.room}<br />
                        Założyciel stołu: {this.props.creator}<br />
                        Zwycięsta: {this.props.victories}<br />
                </p>
            </div>
        );
    }
}

export default Config;