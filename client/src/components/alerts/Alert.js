import React, { Component } from 'react';
import alertStyle from '../../css/alert.module.css';

class Alert extends Component {
    render() {
        return (
            <div className={alertStyle.container}>
                <div className={alertStyle.divAlert}>
                    <h2 className={alertStyle.text}>{this.props.text}</h2>
                    <button className={alertStyle.button} onClick={this.props.cancel}>OK!</button>
                </div>
            </div>
        );
    }
}

export default Alert;