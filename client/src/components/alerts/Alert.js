import React, { Component } from 'react';
import Button from '../buttons/Button';
import alertStyle from '../../css/alert.module.css';

class Alert extends Component {
    render() {
        return (
            <div className={alertStyle.divAlert}>
                <h2 className={alertStyle.text}>{this.props.text}</h2>
                <button className={alertStyle.button} onClick={this.props.cancel}>OK!</button>
            </div>
        );
    }
}

export default Alert;