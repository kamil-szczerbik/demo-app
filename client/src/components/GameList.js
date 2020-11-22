import React, { Component } from 'react';
import GameTile from './GameTile';
import gamesStyle from '../css/games.module.css';

class GamesList extends Component {
    render() {
        return (
            <div className={gamesStyle.container}>
                <GameTile name='KOŚCI' path='/img/main/dices2.jpg' redirect='/kosci'/>
            </div>
        );
    }
}
export default GamesList;