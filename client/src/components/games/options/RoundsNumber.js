import React, { Component } from 'react';
import configStyle from '../../../css/config.module.css';

class RoundsNumber extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={configStyle.divColumn}>
                <p>
                    <label htmlFor='rounds'>Do ilu zwycięstw: </label><br />
                    <select
                        name='rounds'
                        id='rounds'
                        onChange={this.props.handleRoundsNumber}
                        disabled={this.props.leader === this.props.username ? false : true}
                    >
                        <option value='1' selected={this.props.roundsNumber === 1 ? true : false}>1</option>
                        <option value='2' selected={this.props.roundsNumber === 2 ? true : false}>2</option>
                        <option value='3' selected={this.props.roundsNumber === 3 ? true : false}>3</option>
                        <option value='4' selected={this.props.roundsNumber === 4 ? true : false}>4</option>
                        <option value='5' selected={this.props.roundsNumber === 5 ? true : false}>5</option>
                    </select>
                </p>
            </div>
        );
    }
}

export default RoundsNumber;