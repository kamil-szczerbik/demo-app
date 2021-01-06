import React, { Component } from 'react';
import PlayerSeat from './PlayerSeat';

class PlayerSeats extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <PlayerSeat
                    seat={0}
                    path='/placeholders/avatar.jpg'
                    username={this.props.username}
                    creator={this.props.creator}
                    started={this.props.started}
                    playersNumber={this.props.playersNumber}
                    player={this.props.players[0]}
                    amISitting={this.props.amISitting}
                    availableSeat={this.props.availableSeats[0]}
                    sit={this.props.sit}
                    getUp={this.props.getUp}
                    handover={this.props.handover}
                    kick={this.props.kick}
                />
                <PlayerSeat
                    seat={1}
                    path='/placeholders/avatar.jpg'
                    username={this.props.username}
                    creator={this.props.creator}
                    started={this.props.started}
                    playersNumber={this.props.playersNumber}
                    player={this.props.players[1]}
                    amISitting={this.props.amISitting}
                    availableSeat={this.props.availableSeats[1]}
                    sit={this.props.sit}
                    getUp={this.props.getUp}
                    handover={this.props.handover}
                    kick={this.props.kick}
                />
                <PlayerSeat
                    seat={2}
                    path='/placeholders/avatar.jpg'
                    username={this.props.username}
                    creator={this.props.creator}
                    started={this.props.started}
                    playersNumber={this.props.playersNumber}
                    player={this.props.players[2]}
                    amISitting={this.props.amISitting}
                    availableSeat={this.props.availableSeats[2]}
                    sit={this.props.sit}
                    getUp={this.props.getUp}
                    handover={this.props.handover}
                    kick={this.props.kick}
                />
                <PlayerSeat
                    seat={3}
                    path='/placeholders/avatar.jpg'
                    username={this.props.username}
                    creator={this.props.creator}
                    started={this.props.started}
                    playersNumber={this.props.playersNumber}
                    player={this.props.players[3]}
                    amISitting={this.props.amISitting}
                    availableSeat={this.props.availableSeats[3]}
                    sit={this.props.sit}
                    getUp={this.props.getUp}
                    handover={this.props.handover}
                    kick={this.props.kick}
                />
            </div>
        );
    }
}

export default PlayerSeats;