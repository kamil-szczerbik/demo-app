import React, { Component } from 'react';
import chatboxStyle from '../../css/chatbox.module.css';

class ChatboxUserInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInput: 'Wpisz wiadomość...'
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.wipeoutState = this.wipeoutState.bind(this);
        this.retrieveDefaultState = this.retrieveDefaultState.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.state.userInput !== 'Wpisz wiadomość...' && this.state.userInput) {
            this.props.sendChatboxMessage(this.state.userInput);
            this.setState({ userInput: '' });
        }
	}

    handleChange(e) {
        this.setState({ userInput: e.target.value });
    }

    wipeoutState() {
        if (this.state.userInput === 'Wpisz wiadomość...')
            this.setState({ userInput: '' });
    }

    retrieveDefaultState() {
        if (this.state.userInput === '')
            this.setState({ userInput: 'Wpisz wiadomość...'})
	}


    render() {
        return (
            <div className={chatboxStyle.userInput}>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type='text'
                        value={this.state.userInput}
                        onChange={this.handleChange}
                        onFocus={this.wipeoutState}
                        onBlur={this.retrieveDefaultState}
                    />
                    <input
                        type='submit'
                        value='&#8629;'
                    />
                </form>
            </div>
        );
    }
}
export default ChatboxUserInput;