import React, { Component } from 'react';
import chatboxStyle from '../../css/chatbox.module.css';

class Chatbox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={chatboxStyle.chatbox}>
                <ul class={chatboxStyle.list}>
                    {this.props.alerts.map(alert => (
                        <li
                            key={alert.id}
                            class={chatboxStyle.alert}
                        >
                            {alert.alert}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
export default Chatbox;