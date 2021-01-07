import React, { Component } from 'react';
import PlayersNumber from './PlayersNumber';
import RoundsNumber from './RoundsNumber';
import GameType from './GameType';
import DoubleButtonAlert from '../../alerts/DoubleButtonAlert';
import Button from '../../buttons/Button';
import configStyle from '../../../css/config.module.css';

class GameOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doubleButtonAlertMessage: ''
        }
    }

    render() {
        return (
            <>
                <form className={configStyle.optionsPlayers}>
                    <fieldset disabled={this.props.started}>

                        <PlayersNumber
                            playersNumber={this.props.playersNumber}
                            username={this.props.username}
                            creator={this.props.creator}
                            handlePlayersNumber={this.props.handlePlayersNumber}
                        />

                        <RoundsNumber
                            roundsNumber={this.props.roundsNumber}
                            username={this.props.username}
                            creator={this.props.creator}
                            handleRoundsNumber={this.props.handleRoundsNumber}
                        />

                        <GameType
                            type={this.props.type}
                            password={this.props.password}
                            username={this.props.username}
                            creator={this.props.creator}
                            handleType={this.props.handleType}
                        />

                        <div className={configStyle.divColumn}>
                            <Button
                                className='affirmative'
                                disabled={this.props.creator === this.props.username ? false : true}
                                action={this.props.startGame}
                                text='Start!'
                            />
                        </div>

                        <div className={configStyle.divColumn}>
                            <Button
                                className='dismissive'
                                disabled={this.props.creator === this.props.username ? false : true}
                                action={() => this.setState({ doubleButtonAlertMessage: 'Czy na pewno chcesz usunąć ten stół?' })}
                                text='Usuń stół'
                            />
                        </div>

                    </fieldset>
                </form>
                {
                    this.state.doubleButtonAlertMessage !== '' &&
                    <DoubleButtonAlert
                        text={this.state.doubleButtonAlertMessage}
                        button1='Tak'
                        button2='Nie'
                        handleButton1={this.props.handleDeleteBoard}
                        handleButton2={() => this.setState({ doubleButtonAlertMessage: '' })}
                    />
                }
            </>
        );
    }
}
export default GameOptions;