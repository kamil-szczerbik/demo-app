import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import gamesStyle from '../css/games.module.css';

class GameTile extends Component {
    render() {
        return (
            <div className={gamesStyle.tile} onClick={() => this.props.history.push(this.props.redirect)}>
                <h1>{this.props.name}</h1>
                <img src={this.props.path} alt={`Grafika przedstawiająca ${this.props.name.toLowerCase()}`} />
            </div>
        );
    }
}

export default withRouter(GameTile);