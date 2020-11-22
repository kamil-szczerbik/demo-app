import React, { Component } from 'react';
import style from '../../css/style.module.css';


class PlayerBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showButton: false
        }
        this.handleSit = this.handleSit.bind(this);
        this.handleGetUp = this.handleGetUp.bind(this);
        this.handleHandover = this.handleHandover.bind(this);
        this.handleKick = this.handleKick.bind(this);
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

    handleHandover() {
        this.props.handover(this.props.player);
    }

    handleKick() {
        this.props.kick(this.props.player, this.props.seat);
    }

    render() {
        return (
            <div
                className={this.props.disabled === false ? ((this.props.availableSeat === true && this.props.amISitting === false) ? style.playerBarActive : style.playerBar) : style.playerBarDisabled}
                onClick={this.handleSit}
            >
                <h2>{this.props.player}</h2>

                {
                    (this.props.player === this.props.username && !this.props.disabled && !this.props.started) &&
                        <button onClick={this.handleGetUp}>Wstań!</button>
                }
                {
                    (this.props.username === this.props.creator && !this.props.availableSeat && this.props.player !== this.props.creator) &&
                    <>
                        <button onClick={this.handleKick}>Kick</button>
                        <button onClick={this.handleHandover}>LOL</button>
                    </>
                }

                <img src={this.props.path} alt="Awatar gracza"/>
            </div>
        );
    }
}
export default PlayerBar;