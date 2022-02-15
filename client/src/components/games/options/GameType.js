import React, { Component } from 'react';
import configStyle from '../../../css/config.module.css';

class GameType extends Component {
    render() {
        return (
            <>
                <div className={configStyle.divColumn}>
                    <p>
                        Rodzaj gry:
                        <br />
                        <input
                            type='radio'
                            id='public'
                            name='gameType'
                            value='public'
                            checked={this.props.gameType === 'public'}
                            onChange={this.props.handleGameType}
                            disabled={this.props.leader === this.props.username ? false : true}
                        />
                        <label htmlFor='public'>publiczna</label>

                        <br />
                        <input
                            type='radio'
                            id='private'
                            name='gameType'
                            value='private'
                            checked={this.props.gameType === 'private'}
                            onChange={this.props.handleGameType}
                            disabled={this.props.leader === this.props.username ? false : true}
                        />
                        <label htmlFor='private'>prywatna</label>
                    </p>
                </div>
                <div className={configStyle.divColumn}>
                    <p>
                        {
                        this.props.gameType === 'private' &&
                        <>
                            Hasło:
                            <br />
                            <b className={configStyle.password}>{this.props.password}</b>
                        </>
                        }
                    </p>
                </div>
            </>
        );
    }
}

export default GameType;