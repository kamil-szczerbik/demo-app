import React, { Component } from 'react';
import chatboxStyle from '../../css/chatbox.module.css';

class ChatboxConversation extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={chatboxStyle.conversation}>
                <ul class={chatboxStyle.list}>
                    {this.props.alerts.map(newAlert => (
                        <li
                            key={newAlert.id}
                            className={chatboxStyle.alert}
                        >
                            {
                                newAlert.username &&
                                <span
                                    className={chatboxStyle.username}
                                >
                                    {newAlert.username + ': '}
                                </span>
							}
                            {
                                newAlert.alert
                            }
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
export default ChatboxConversation;