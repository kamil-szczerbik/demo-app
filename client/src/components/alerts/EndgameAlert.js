import React, { Component } from 'react';
import alertStyle from '../../css/alert.module.css';

class EndgameAlert extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={alertStyle.divAlert}>
                <h2 className={alertStyle.text}>{this.props.text}</h2>
                <button className={alertStyle.button1} onClick={this.props.restart}>Rewanż</button>
                <button className={alertStyle.button2} onClick={this.props.quit}>Wyjdź z gry</button>
            </div>
        );
    }
}

export default EndgameAlert;// JavaScript source code
