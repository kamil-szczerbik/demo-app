import React, { Component } from 'react';
import ChatboxConversation from './ChatboxConversation';
import ChatboxUserInput from './ChatboxUserInput';
import chatboxStyle from '../../css/chatbox.module.css';

class Chatbox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={chatboxStyle.chatbox}>
                <ChatboxConversation alerts={this.props.alerts}/>
                <ChatboxUserInput sendChatboxMessage={this.props.sendChatboxMessage}/>
            </div>
        );
    }
}
export default Chatbox;