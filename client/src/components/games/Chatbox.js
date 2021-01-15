import React, { Component } from 'react';
import socket from '../../nonUI/socketIO';
import chatboxStyle from '../../css/chatbox.module.css';

class Chatbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alerts: ['Założony nowy stół!']
        }
        this.test = '';
    }

    componentDidMount() {
        socket.on('chatAlert', (alert) => {
            const newAlerts = this.state.alerts;
            newAlerts.push(alert);
            this.setState({ alerts: newAlerts });
        });
    }

    componentDidUpdate() {
        this.test = this.state.alerts.map(alert => (
            <li>{alert}</li>
            ));
	}

    render() {
        return (
            <div className={chatboxStyle.chatbox}>
                <ul>
                    {this.test}
                </ul>
            </div>
        );
    }
}
export default Chatbox;