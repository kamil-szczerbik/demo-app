import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Alert from '../alerts/Alert';
import socket from '../../nonUI/socketIO';
import configStyle from '../../css/config.module.css';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            remainedTime: '20:00',
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
                    <span
                        role="img"
                        aria-label="Alarm Clock"
                    >
                        &#9200; {this.state.remainedTime}
                    </span>
                </p>
                {
                    this.state.alertMessage &&
                    <Alert text={this.state.alertMessage} cancel={() => this.props.history.push('/')} />
                }
            </>
        );
    }
}

export default withRouter(Timer);