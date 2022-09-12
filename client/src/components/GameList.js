import React, { Component } from 'react';
import GameTile from './GameTile';
import tilesStyle from '../css/tiles.module.css';

class GamesList extends Component {
    render() {
        return (
            <div className={tilesStyle.container}>
                <GameTile name='KOŚCI' path='/img/main/dices.jpg' redirect='/kosci'/>
                <GameTile name='WORK IN PROGRESS' path='/img/main/WIP1.jpg' redirect='/kosci' />
                <p>
                    Testowe konto:  <br />
                    login - user    <br />
                    haslo - Test123
                </p>
            </div>
        );
    }
}

export default GamesList;