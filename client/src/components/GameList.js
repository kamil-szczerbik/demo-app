import React, { Component } from 'react';
import GameTile from './GameTile';
import tilesStyle from '../css/tiles.module.css';

class GamesList extends Component {
    render() {
        return (
            <div className={tilesStyle.container}>
                <GameTile name='KOŚCI' path='/img/main/dices.jpg' redirect='/kosci'/>
                <GameTile name='WIP1' path='/img/main/WIP1.jpg' redirect='/kosci'/>
                <GameTile name='WIP2' path='/img/main/WIP2.jpg' redirect='/kosci'/>
                <GameTile name='WIP3' path='/img/main/WIP3.jpg' redirect='/kosci'/>
                <GameTile name='WIP4' path='/img/main/WIP4.jpg' redirect='/kosci'/>
                <GameTile name='WIP5' path='/img/main/WIP5.jpg' redirect='/kosci'/>
                <GameTile name='WIP6' path='/img/main/WIP6.jpg' redirect='/kosci'/>
                <GameTile name='WIP7' path='/img/main/WIP7.jpg' redirect='/kosci'/>
                <GameTile name='WIP8' path='/img/main/WIP8.jpg' redirect='/kosci'/>
            </div>
        );
    }
}

export default GamesList;