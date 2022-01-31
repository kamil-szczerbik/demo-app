import React, { Component } from 'react';
import Scrollbar from '../scrollbar/Scrollbar';
import chatboxStyle from '../../css/chatbox.module.css';

class ChatboxConversation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hovering: false,
            newMessagesInfo: false
        };

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.hideNewMessagesInfo = this.hideNewMessagesInfo.bind(this);
        this.showNewMessagesInfo = this.showNewMessagesInfo.bind(this);

        this.scrollableElementRef = React.createRef();
    }

    componentDidUpdate() {
        if (this.state.newMessagesInfo)
            if (this.scrollableElementRef.current.scrollTop === this.scrollableElementRef.current.scrollHeight - this.scrollableElementRef.current.clientHeight)
                this.hideNewMessagesInfo();
    }

    onMouseOver() {
        this.setState({ hovering: true });
    }

    onMouseOut() {
        this.setState({ hovering: false });
    }

    handleScroll() {
        this.forceUpdate();
    }

    hideNewMessagesInfo() {
        this.setState({ newMessagesInfo: false });
    }

    showNewMessagesInfo() {
        this.setState({ newMessagesInfo: true });
    }

    render() {
        return (
            <div
                className={chatboxStyle.conversation}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
            >
                <ul
                    className={chatboxStyle.list}
                    onScroll={this.handleScroll}
                    ref={this.scrollableElementRef}
                >
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

                {
                    this.state.newMessagesInfo &&
                    <p onClick={this.hideNewMessagesInfo}>&darr; Przewiń do nowych wiadomości &darr;</p>
                }
                

                <Scrollbar
                    alertsLength={this.props.alertsLength}
                    newMessagesInfo={this.state.newMessagesInfo}
                    hovering={this.state.hovering}
                    scrollableElementRef={this.scrollableElementRef}
                    showNewMessagesInfo={this.showNewMessagesInfo}
                />
            </div>
        );
    }
}

export default ChatboxConversation;