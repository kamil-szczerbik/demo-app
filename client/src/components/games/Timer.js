import React, { Component } from 'react';
import Alert from '../alerts/Alert';
import socket from '../../nonUI/socketIO';
import configStyle from '../../css/config.module.css';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            remainedTime: '05:00',
            alertMessage: ''
        }
    }

    componentDidMount() {
        socket.on('countDown', (newRemainedTime) => {
            this.setState({ remainedTime: newRemainedTime });
        });

        socket.on('timeHasEnded', () => {
            this.setState({ alertMessage: 'Niestety, dozwolony czas rozgrywki upłynął. Kliknij, aby wrócić do strony głownej.' });
        });
    }

    componentWillUnmount() {
        socket.off('countDown');
        socket.off('timeHasEnded');
    }

    render() {
        return (
            <>
                <p className={configStyle.time}>
                    ⏰ {this.state.remainedTime}
                </p>
                {
                    this.state.alertMessage !== '' &&
                    <Alert text={this.state.alertMessage} cancel={() => this.setState({ alertMessage: '' })} />
                }
            </>
        );
    }
}

export default Timer;