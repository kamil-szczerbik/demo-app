import React, { Component } from 'react';
import configStyle from '../../../css/config.module.css';

class PlayersNumber extends Component {
    constructor(props) {
        super(props);
/*        this.state = {
            playersNumber: 2
        }
        this.handlePlayersNumber = this.handlePlayersNumber.bind(this);*/
    }

/*    handlePlayersNumber(e) {
        const newPlayersNumber = parseInt(e.target.value); //value nie może być liczbą
        this.setState({ playersNumber: newPlayersNumber });
    }*/

    render() {
        return (
            <div className={configStyle.divColumn}>
                <p>
                    Liczba graczy:<br />
                    <input
                        type='radio'
                        id='players2'
                        name='players'
                        value='2'
                        checked={this.props.playersNumber === 2}
                        onChange={this.props.handlePlayersNumber}
                        disabled={this.props.creator === this.props.username ? false : true}
                    />
                    <label htmlFor='players2'>2</label>
                    <input
                        type="radio"
                        id='players3'
                        name='players'
                        value='3'
                        checked={this.props.playersNumber === 3}
                        onChange={this.props.handlePlayersNumber}
                        disabled={this.props.creator === this.props.username ? false : true}
                    />
                    <label htmlFor='players3'>3</label>
                    <input
                        type="radio"
                        id='players4'
                        name='players'
                        value='4'
                        checked={this.props.playersNumber === 4}
                        onChange={this.props.handlePlayersNumber}
                        disabled={this.props.creator === this.props.username ? false : true}
                    />
                    <label htmlFor='players4'>4</label>
                </p>
            </div>
        );
    }
}

export default PlayersNumber;