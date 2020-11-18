//Komponent wyœwietlaj¹cy ustalony komunikat z guzikiem 'OK!', którego klikniêcie go zamyka

import React, { Component } from 'react';
import alertStyle from '../../css/alert.module.css';

class Alert extends Component {
    constructor(props) {
        super(props);
    }

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