import React, { Component } from 'react';
import configStyle from '../../../css/config.module.css';

class GameType extends Component {
    constructor(props) {
        super(props);
    }

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
                            checked={this.props.type === 'public'}
                            onChange={this.props.handleType}
                            disabled={this.props.creator === this.props.username ? false : true}
                        />
                        <label htmlFor='public'>publiczna</label>

                        <br />
                        <input
                            type='radio'
                            id='private'
                            name='gameType'
                            value='private'
                            checked={this.props.type === 'private'}
                            onChange={this.props.handleType}
                            disabled={this.props.creator === this.props.username ? false : true}
                        />
                        <label htmlFor='private'>prywatna</label>
                    </p>
                </div>
                <div className={configStyle.divColumn}>
                    <p>
                        {
                        this.props.type === 'private' &&
                        <>
                            Hasło:
                            <br />
                            <b>{this.props.password}</b>
                        </>
                        }
                    </p>
                </div>
            </>
        );
    }
}

export default GameType;