import React, { Component } from 'react';
import PlayersNumber from './PlayersNumber';
import RoundsNumber from './RoundsNumber';
import GameType from './GameType';
import configStyle from '../../../css/config.module.css';

class GameOptions extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form className={configStyle.optionsPlayers}>
                <fieldset disabled={this.props.started}>
                    <PlayersNumber playersNumber={this.props.playersNumber} username={this.props.username} creator={this.props.creator} handlePlayersNumber={this.props.handlePlayersNumber}/>
                    <RoundsNumber roundsNumber={this.props.roundsNumber} username={this.props.username} creator={this.props.creator} handleRoundsNumber={this.props.handleRoundsNumber}/>
                    <GameType type={this.props.type} password={this.props.password} username={this.props.username} creator={this.props.creator} handleType={this.props.handleType}/>
                </fieldset>
            </form>
        );
    }
}
export default GameOptions;