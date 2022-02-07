import React, { Component } from 'react';
import PlayerSeat from './PlayerSeat';

class PlayerSeats extends Component {
    render() {
        return (
            <div>
                <PlayerSeat
                    seat={0}
                    path='/placeholders/avatar.jpg'
                    username={this.props.username}
                    leader={this.props.leader}
                    started={this.props.started}
                    playersNumber={this.props.playersNumber}
                    playerUsername={this.props.sittingPlayers[0]}
                    amISitting={this.props.amISitting}
                    availableSeat={this.props.availableSeats[0]}
                    sitDown={this.props.sitDown}
                    getUp={this.props.getUp}
                    passLeaderPrivileges={this.props.passLeaderPrivileges}
                    kickPlayer={this.props.kickPlayer}
                />
                <PlayerSeat
                    seat={1}
                    path='/placeholders/avatar.jpg'
                    username={this.props.username}
                    leader={this.props.leader}
                    started={this.props.started}
                    playersNumber={this.props.playersNumber}
                    playerUsername={this.props.sittingPlayers[1]}
                    amISitting={this.props.amISitting}
                    availableSeat={this.props.availableSeats[1]}
                    sitDown={this.props.sitDown}
                    getUp={this.props.getUp}
                    passLeaderPrivileges={this.props.passLeaderPrivileges}
                    kickPlayer={this.props.kickPlayer}
                />
                <PlayerSeat
                    seat={2}
                    path='/placeholders/avatar.jpg'
                    username={this.props.username}
                    leader={this.props.leader}
                    started={this.props.started}
                    playersNumber={this.props.playersNumber}
                    playerUsername={this.props.sittingPlayers[2]}
                    amISitting={this.props.amISitting}
                    availableSeat={this.props.availableSeats[2]}
                    sitDown={this.props.sitDown}
                    getUp={this.props.getUp}
                    passLeaderPrivileges={this.props.passLeaderPrivileges}
                    kickPlayer={this.props.kickPlayer}
                />
                <PlayerSeat
                    seat={3}
                    path='/placeholders/avatar.jpg'
                    username={this.props.username}
                    leader={this.props.leader}
                    started={this.props.started}
                    playersNumber={this.props.playersNumber}
                    playerUsername={this.props.sittingPlayers[3]}
                    amISitting={this.props.amISitting}
                    availableSeat={this.props.availableSeats[3]}
                    sitDown={this.props.sitDown}
                    getUp={this.props.getUp}
                    passLeaderPrivileges={this.props.passLeaderPrivileges}
                    kickPlayer={this.props.kickPlayer}
                />
            </div>
        );
    }
}

export default PlayerSeats;