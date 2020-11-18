import React, { Component } from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';
import gamesStyle from '../css/games.module.css';

class GameTile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        };
    }

    render() {
        return (
            <div className={gamesStyle.tile} onClick={() => this.setState({redirect: true})}>
                <h1>{this.props.name}</h1>
                <img src={this.props.path} alt={`Grafika przedstawiająca ${this.props.name.toLowerCase()}`} />
                {
                    this.state.redirect &&
                        <Redirect to={this.props.redirect} />
                }
            </div>
        );
    }
}
export default GameTile;