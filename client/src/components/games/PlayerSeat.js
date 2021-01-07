import React, { Component } from 'react';
import configStyle from '../../css/config.module.css';

class PlayerSeat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showButton: false
        }
        this.handleSit = this.handleSit.bind(this);
        this.handleGetUp = this.handleGetUp.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if ((props.disabled && state.showButton) || props.started)
            return { showButton: false };
        else
            return null;
    }

    handleSit() {
        if (this.props.availableSeat && !this.props.disabled && !this.props.amISitting) {
            this.props.sit(this.props.seat);
            this.setState({ showButton: true });
        }
    }

    handleGetUp() {
        this.props.getUp(this.props.seat);
        this.setState({ showButton: false });
    }

    render() {
        return (
            <div
                className={this.props.playersNumber > this.props.seat ? ((this.props.availableSeat === true && this.props.amISitting === false) ? configStyle.playerBarActive : configStyle.playerBar) : configStyle.playerBarDisabled}
                onClick={this.handleSit}
            >
                <h2 className={configStyle.nickname}>{this.props.player}</h2>
                {
                    (this.props.player === this.props.username && !this.props.disabled && !this.props.started) &&
                    <img src='/img/redX.jpg' className={configStyle.getUp} onClick={this.handleGetUp} alt='Przycisk do wstania od stołu' />
                }
                {
                    (this.props.username === this.props.creator && !this.props.availableSeat && this.props.player !== this.props.creator) &&
                    <>
                        <button onClick={() => this.props.kick(this.props.player, this.props.seat)}>Kick</button>
                        <button onClick={() => this.props.handover(this.props.player)}>LOL</button>
                    </>
                }
                <img src={this.props.path} className={configStyle.avatar} alt="Awatar gracza"/>
            </div>
        );
    }
}

export default PlayerSeat;