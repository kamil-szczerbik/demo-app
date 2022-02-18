import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PlayersNumber from './PlayersNumber';
import RoundsNumber from './RoundsNumber';
import GameType from './GameType';
import Button from '../../buttons/Button';
import configStyle from '../../../css/config.module.css';
import buttonStyle from '../../../css/button.module.css';

class GameOptions extends Component {
    constructor(props) {
        super(props);
        this.redirectBoardsList = this.redirectBoardsList.bind(this);
    }

    redirectBoardsList() {
        this.props.history.push({
            pathname: '/kosci'
        });
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

                        <div className={buttonStyle.buttonsContainer}>
                            <Button
                                    className='affirmative'
                                    disabled={this.props.leader === this.props.username ? false : true}
                                    action={this.props.startGame}
                                    text='Start!'
                            />
                    
                            <Button
                                className='dissmisive'
                                disabled={this.props.started ? true : false}
                                action={this.redirectBoardsList}
                                text='Wyjdź'
                            />
                        </div>
                    </fieldset>
                </form>
            </>
        );
    }
}
export default withRouter(GameOptions);