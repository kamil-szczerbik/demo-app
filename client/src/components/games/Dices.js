//Komponent, kt�ry stanowi plansz� do gry w ko�ci

import React, { Component } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import URLImage from './URLImage';
import socket from '../../nonUI/socketIO';
import style from '../../css/style.module.css';

class Dices extends Component {
    constructor(props) {
        super(props);

        this.dicesReroll = [false, false, false, false, false];
        this.update = false;

        this.ATTRS = {
            stroke: 'white',
            strokeWidth: 8,
            dash: [0, 10, 10, 0],
        }

        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.handleDice = this.handleDice.bind(this);
        this.handleReroll = this.handleReroll.bind(this);
    }

    /*mouseEnter i mouseLeave s� w tym komponencie, bo korzysta z niego zar�wno button do rerollu (tu), jak i kostki (komponent ni�ej)

    mouseEnter - kursor b�dzie pointer nad kostk�, je�li ju� nie przerzucili�my dwa raz i nad guzikiem do przerzucenia, 
    je�li zaznaczyli�my jak�� kostk�*/
    mouseEnter(e) {
        if (this.props.mySeat === this.props.activePlayer && ((this.props.canRoll !== 2 && e.target.index !== 7) || (e.target.index === 7 && this.dicesReroll.indexOf(true) !== -1))) {
            const container = e.target.getStage().container();
            container.style.cursor = "pointer";
        }
    }

    //mouseLeave - kursor zmieni si� na defaultowy
    mouseLeave(e) {
        if (this.props.mySeat === this.props.activePlayer) {
            const container = e.target.getStage().container();
            container.style.cursor = "default";
        }
    }

    /*zmienia warto�� reprezentuj�c� klikni�t� ko��: false - niezaznaczona, true - zaznaczona (do przerzucenia)
     zwraca r�wnie� sta�y obiekt, przechowuj�cy atrybuty do ustawienia na kostce (bez sensu jest za ka�dym razem dawa� te atrybuty
     ale nie widz� innej metody, componentDidMount dzieje si� ju� po renderze, wi�c odpada)*/
    handleDice(e) {
        if (this.props.mySeat === this.props.activePlayer) {
            this.dicesReroll[e.target.index - 2] = !this.dicesReroll[e.target.index - 2];
            return this.ATTRS;
        }
        
    }

    //Kursor zmieniamy na defaultowy w momencie klikni�cia na guzik od przerzutu
    handleReroll(e) {
        if (this.props.rollNumber !== 2 && this.dicesReroll.indexOf(true) !== -1) {
            const container = e.target.getStage().container();
            container.style.cursor = "default";
        /*this.props.handleReroll(e);*/
            const newDicesReroll = this.dicesReroll;
            socket.emit('rerollDices', this.props.room, newDicesReroll);
            this.dicesReroll.fill(false);
        }
    }

    render() {
        return (
            <div className={style.divCanvas}>
                {/*<button onClick={this.props.generateDices}>Roll the Dices!</button>*/}
                <Stage width={500} height={688}>
                    <Layer>
                        <Rect width={500} height={94} fill={'green'} />  
                        <Rect width={500} height={500} y={94} fill={'green'} />
                        {this.props.urlDices.length !== 0 && <>
                            <URLImage src={this.props.urlDices[0]} width={50} height={50} x={this.props.posArray[0][0]} y={this.props.posArray[1][0]} rotation={this.props.rotArray[0]} update={this.update} canClick={this.props.canRoll} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.handleDice}/>
                            <URLImage src={this.props.urlDices[1]} width={50} height={50} x={this.props.posArray[0][1]} y={this.props.posArray[1][1]} rotation={this.props.rotArray[1]} update={this.update} canClick={this.props.canRoll} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.handleDice}/>
                            <URLImage src={this.props.urlDices[2]} width={50} height={50} x={this.props.posArray[0][2]} y={this.props.posArray[1][2]} rotation={this.props.rotArray[2]} update={this.update} canClick={this.props.canRoll} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.handleDice}/>
                            <URLImage src={this.props.urlDices[3]} width={50} height={50} x={this.props.posArray[0][3]} y={this.props.posArray[1][3]} rotation={this.props.rotArray[3]} update={this.update} canClick={this.props.canRoll} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.handleDice}/>
                            <URLImage src={this.props.urlDices[4]} width={50} height={50} x={this.props.posArray[0][4]} y={this.props.posArray[1][4]} rotation={this.props.rotArray[4]} update={this.update} canClick={this.props.canRoll} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.handleDice}/>
                            {/*w e siedz� atrybuty obiektu Konva, dlatego wrzucam tu tablic� dicesReroll, jak klikn�, to w funkcji obs�uguj�cej to zdarzenie mam dost�p do tej tablicy poprzez obiekt e*/}
                            <Rect width={50} height={50} fill={'white'} x={225} y={425} dicesReroll={this.dicesReroll} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.handleReroll} />
                        </>
                        }
                        <Rect width={500} height={94} y={594} fill={'green'} />    
                    </Layer>
                </Stage>
            </div>
        );
    }
}

export default Dices;