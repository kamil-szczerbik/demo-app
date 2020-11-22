import React, { Component } from 'react';
import alertStyle from '../../css/alert.module.css';

class DoubleButtonAlert extends Component {
    render() {
        return (
            <div className={alertStyle.divFixed}>
                <div className={alertStyle.divAlert}>
                    <h2 className={alertStyle.text}>{this.props.text}</h2>
                    <div>
                        <button className={alertStyle.button1} onClick={this.props.handleButton1}>{this.props.button1}</button>
                        <button className={alertStyle.button2} onClick={this.props.handleButton2}>{this.props.button2}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DoubleButtonAlert;
