import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import tilesStyle from '../css/tiles.module.css';

class GameTile extends Component {
    render() {
        return (
            <div
                className={tilesStyle.tile}
                name={this.props.name}
                onClick={() => this.props.history.push(this.props.redirect)}
            >
                <img
                    src={this.props.path}
                    alt={`Grafika przedstawiająca ${this.props.name.toLowerCase()}`}
                />
            </div>
        );
    }
}

export default withRouter(GameTile);