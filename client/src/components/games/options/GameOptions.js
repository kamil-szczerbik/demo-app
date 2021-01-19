import React, { Component } from 'react';
import PlayersNumber from './PlayersNumber';
import RoundsNumber from './RoundsNumber';
import GameType from './GameType';
import Button from '../../buttons/Button';
import configStyle from '../../../css/config.module.css';

class GameOptions extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <form className={configStyle.optionsPlayers}>
                    <fieldset disabled={this.props.started}>

                        <PlayersNumber
                            playersNumber={this.props.playersNumber}
                            username={this.props.username}
                            leader={this.props.leader}
                            handlePlayersNumber={this.props.handlePlayersNumber}
                        />

                        <RoundsNumber
                            roundsNumber={this.props.roundsNumber}
                            username={this.props.username}
                            leader={this.props.leader}
                            handleRoundsNumber={this.props.handleRoundsNumber}
                        />

                        <GameType
                            gameType={this.props.gameType}
                            password={this.props.password}
                            username={this.props.username}
                            leader={this.props.leader}
                            handleGameType={this.props.handleGameType}
                        />

                        <Button
                                className='affirmative'
                                disabled={this.props.leader === this.props.username ? false : true}
                                action={this.props.startGame}
                                text='Start!'
                        />

                    </fieldset>
                </form>
            </>
        );
    }
}
export default GameOptions;