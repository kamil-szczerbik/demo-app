import React, { Component } from 'react';
import TableValues from './TableValues';
import tabStyle from '../../css/table.module.css';

class Table extends Component {
    render() {
        return (
            <div className={tabStyle.divTable}>
                <table className={tabStyle.table}>

                    <colgroup>
                        <col span={this.props.playersNumber + 1}/>
                        <col className={tabStyle.inActiveColumns}/>
                        <col className={tabStyle.inActiveColumns}/>
                    </colgroup>


                    <thead>
                        <tr>
                            <th></th>                                                                               {/*nagłówek tabeli, w zależności od liczby graczy, jest albo wyszarzony albo czarny*/}
                            <th className={tabStyle.active}>1</th>      {/*nie korzystamy z this.props.playersNumber, żeby stylizowanie zadziałało dopiero w momencie odpalenia gry*/}
                            <th className={tabStyle.active}>2</th>
                            <th className={this.props.playersNumber > 2 ? tabStyle.active : tabStyle.inActive}>3</th>
                            <th className={this.props.playersNumber > 3 ? tabStyle.active : tabStyle.inActive}>4</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <TableValues player={0} mySeat={this.props.mySeat} setScore={this.props.setScore} value={0} proposedValue={this.props.activePlayer === 0 && this.props.proposedValues[0]} score={this.props.score[0][0]}/>
                            <TableValues player={1} mySeat={this.props.mySeat} setScore={this.props.setScore} value={0} proposedValue={this.props.activePlayer === 1 && this.props.proposedValues[0]} score={this.props.score[1][0]}/>
                            <TableValues player={2} mySeat={this.props.mySeat} setScore={this.props.setScore} value={0} proposedValue={this.props.activePlayer === 2 && this.props.proposedValues[0]} score={this.props.playersNumber > 2 && this.props.score[2][0]}/>
                            <TableValues player={3} mySeat={this.props.mySeat} setScore={this.props.setScore} value={0} proposedValue={this.props.activePlayer === 3 && this.props.proposedValues[0]} score={this.props.playersNumber > 3 && this.props.score[3][0]}/>
                        </tr>
                        <tr>
                            <td>2</td>
                            <TableValues player={0} mySeat={this.props.mySeat} setScore={this.props.setScore} value={1} proposedValue={this.props.activePlayer === 0 && this.props.proposedValues[1]} score={this.props.score[0][1]} />
                            <TableValues player={1} mySeat={this.props.mySeat} setScore={this.props.setScore} value={1} proposedValue={this.props.activePlayer === 1 && this.props.proposedValues[1]} score={this.props.score[1][1]} />
                            <TableValues player={2} mySeat={this.props.mySeat} setScore={this.props.setScore} value={1} proposedValue={this.props.activePlayer === 2 && this.props.proposedValues[1]} score={this.props.playersNumber > 2 && this.props.score[2][1]} />
                            <TableValues player={3} mySeat={this.props.mySeat} setScore={this.props.setScore} value={1} proposedValue={this.props.activePlayer === 3 && this.props.proposedValues[1]} score={this.props.playersNumber > 3 && this.props.score[3][1]} />
                        </tr>
                        <tr>
                            <td>3</td>
                            <TableValues player={0} mySeat={this.props.mySeat} setScore={this.props.setScore} value={2} proposedValue={this.props.activePlayer === 0 && this.props.proposedValues[2]} score={this.props.score[0][2]} />
                            <TableValues player={1} mySeat={this.props.mySeat} setScore={this.props.setScore} value={2} proposedValue={this.props.activePlayer === 1 && this.props.proposedValues[2]} score={this.props.score[1][2]} />
                            <TableValues player={2} mySeat={this.props.mySeat} setScore={this.props.setScore} value={2} proposedValue={this.props.activePlayer === 2 && this.props.proposedValues[2]} score={this.props.playersNumber > 2 && this.props.score[2][2]} />
                            <TableValues player={3} mySeat={this.props.mySeat} setScore={this.props.setScore} value={2} proposedValue={this.props.activePlayer === 3 && this.props.proposedValues[2]} score={this.props.playersNumber > 3 && this.props.score[3][2]} />
                        </tr>
                        <tr>
                            <td>4</td>
                            <TableValues player={0} mySeat={this.props.mySeat} setScore={this.props.setScore} value={3} proposedValue={this.props.activePlayer === 0 && this.props.proposedValues[3]} score={this.props.score[0][3]} />
                            <TableValues player={1} mySeat={this.props.mySeat} setScore={this.props.setScore} value={3} proposedValue={this.props.activePlayer === 1 && this.props.proposedValues[3]} score={this.props.score[1][3]} />
                            <TableValues player={2} mySeat={this.props.mySeat} setScore={this.props.setScore} value={3} proposedValue={this.props.activePlayer === 2 && this.props.proposedValues[3]} score={this.props.playersNumber > 2 && this.props.score[2][3]} />
                            <TableValues player={3} mySeat={this.props.mySeat} setScore={this.props.setScore} value={3} proposedValue={this.props.activePlayer === 3 && this.props.proposedValues[3]} score={this.props.playersNumber > 3 && this.props.score[3][3]} />
                        </tr>
                        <tr>
                            <td>5</td>
                            <TableValues player={0} mySeat={this.props.mySeat} setScore={this.props.setScore} value={4} proposedValue={this.props.activePlayer === 0 && this.props.proposedValues[4]} score={this.props.score[0][4]} />
                            <TableValues player={1} mySeat={this.props.mySeat} setScore={this.props.setScore} value={4} proposedValue={this.props.activePlayer === 1 && this.props.proposedValues[4]} score={this.props.score[1][4]} />
                            <TableValues player={2} mySeat={this.props.mySeat} setScore={this.props.setScore} value={4} proposedValue={this.props.activePlayer === 2 && this.props.proposedValues[4]} score={this.props.playersNumber > 2 && this.props.score[2][4]} />
                            <TableValues player={3} mySeat={this.props.mySeat} setScore={this.props.setScore} value={4} proposedValue={this.props.activePlayer === 3 && this.props.proposedValues[4]} score={this.props.playersNumber > 3 && this.props.score[3][4]} />
                        </tr>
                        <tr>
                            <td>6</td>
                            <TableValues player={0} mySeat={this.props.mySeat} setScore={this.props.setScore} value={5} proposedValue={this.props.activePlayer === 0 && this.props.proposedValues[5]} score={this.props.score[0][5]} />
                            <TableValues player={1} mySeat={this.props.mySeat} setScore={this.props.setScore} value={5} proposedValue={this.props.activePlayer === 1 && this.props.proposedValues[5]} score={this.props.score[1][5]} />
                            <TableValues player={2} mySeat={this.props.mySeat} setScore={this.props.setScore} value={5} proposedValue={this.props.activePlayer === 2 && this.props.proposedValues[5]} score={this.props.playersNumber > 2 && this.props.score[2][5]} />
                            <TableValues player={3} mySeat={this.props.mySeat} setScore={this.props.setScore} value={5} proposedValue={this.props.activePlayer === 3 && this.props.proposedValues[5]} score={this.props.playersNumber > 3 && this.props.score[3][5]} />
                        </tr>
                        <tr>
                            <td>= (+)</td>
                            <td>{this.props.score[0][13]}</td>
                            <td>{this.props.score[1][13]}</td>
                            <td>{this.props.playersNumber > 2 && this.props.score[2][13]}</td>
                            <td>{this.props.playersNumber > 3 && this.props.score[3][13]}</td>
                        </tr>
                        <tr>
                            <td>x3</td>
                            <TableValues player={0} mySeat={this.props.mySeat} setScore={this.props.setScore} value={6} proposedValue={this.props.activePlayer === 0 && this.props.proposedValues[6]} score={this.props.score[0][6]} />
                            <TableValues player={1} mySeat={this.props.mySeat} setScore={this.props.setScore} value={6} proposedValue={this.props.activePlayer === 1 && this.props.proposedValues[6]} score={this.props.score[1][6]} />
                            <TableValues player={2} mySeat={this.props.mySeat} setScore={this.props.setScore} value={6} proposedValue={this.props.activePlayer === 2 && this.props.proposedValues[6]} score={this.props.playersNumber > 2 && this.props.score[2][6]} />
                            <TableValues player={3} mySeat={this.props.mySeat} setScore={this.props.setScore} value={6} proposedValue={this.props.activePlayer === 3 && this.props.proposedValues[6]} score={this.props.playersNumber > 3 && this.props.score[3][6]} />
                        </tr>
                        <tr>
                            <td>x4</td>
                            <TableValues player={0} mySeat={this.props.mySeat} setScore={this.props.setScore} value={7} proposedValue={this.props.activePlayer === 0 && this.props.proposedValues[7]} score={this.props.score[0][7]} />
                            <TableValues player={1} mySeat={this.props.mySeat} setScore={this.props.setScore} value={7} proposedValue={this.props.activePlayer === 1 && this.props.proposedValues[7]} score={this.props.score[1][7]} />
                            <TableValues player={2} mySeat={this.props.mySeat} setScore={this.props.setScore} value={7} proposedValue={this.props.activePlayer === 2 && this.props.proposedValues[7]} score={this.props.playersNumber > 2 && this.props.score[2][7]} />
                            <TableValues player={3} mySeat={this.props.mySeat} setScore={this.props.setScore} value={7} proposedValue={this.props.activePlayer === 3 && this.props.proposedValues[7]} score={this.props.playersNumber > 3 && this.props.score[3][7]} />
                        </tr>
                        <tr>
                            <td>3+2</td>
                            <TableValues player={0} mySeat={this.props.mySeat} setScore={this.props.setScore} value={8} proposedValue={this.props.activePlayer === 0 && this.props.proposedValues[8]} score={this.props.score[0][8]} />
                            <TableValues player={1} mySeat={this.props.mySeat} setScore={this.props.setScore} value={8} proposedValue={this.props.activePlayer === 1 && this.props.proposedValues[8]} score={this.props.score[1][8]} />
                            <TableValues player={2} mySeat={this.props.mySeat} setScore={this.props.setScore} value={8} proposedValue={this.props.activePlayer === 2 && this.props.proposedValues[8]} score={this.props.playersNumber > 2 && this.props.score[2][8]} />
                            <TableValues player={3} mySeat={this.props.mySeat} setScore={this.props.setScore} value={8} proposedValue={this.props.activePlayer === 3 && this.props.proposedValues[8]} score={this.props.playersNumber > 3 && this.props.score[3][8]} />
                        </tr>
                        <tr>
                            <td>M. Strit</td>
                            <TableValues player={0} mySeat={this.props.mySeat} setScore={this.props.setScore} value={9} proposedValue={this.props.activePlayer === 0 && this.props.proposedValues[9]} score={this.props.score[0][9]} />
                            <TableValues player={1} mySeat={this.props.mySeat} setScore={this.props.setScore} value={9} proposedValue={this.props.activePlayer === 1 && this.props.proposedValues[9]} score={this.props.score[1][9]} />
                            <TableValues player={2} mySeat={this.props.mySeat} setScore={this.props.setScore} value={9} proposedValue={this.props.activePlayer === 2 && this.props.proposedValues[9]} score={this.props.playersNumber > 2 && this.props.score[2][9]} />
                            <TableValues player={3} mySeat={this.props.mySeat} setScore={this.props.setScore} value={9} proposedValue={this.props.activePlayer === 3 && this.props.proposedValues[9]} score={this.props.playersNumber > 3 && this.props.score[3][9]} />
                        </tr>
                        <tr>
                            <td>D. Strit</td>
                            <TableValues player={0} mySeat={this.props.mySeat} setScore={this.props.setScore} value={10} proposedValue={this.props.activePlayer === 0 && this.props.proposedValues[10]} score={this.props.score[0][10]} />
                            <TableValues player={1} mySeat={this.props.mySeat} setScore={this.props.setScore} value={10} proposedValue={this.props.activePlayer === 1 && this.props.proposedValues[10]} score={this.props.score[1][10]} />
                            <TableValues player={2} mySeat={this.props.mySeat} setScore={this.props.setScore} value={10} proposedValue={this.props.activePlayer === 2 && this.props.proposedValues[10]} score={this.props.playersNumber > 2 && this.props.score[2][10]} />
                            <TableValues player={3} mySeat={this.props.mySeat} setScore={this.props.setScore} value={10} proposedValue={this.props.activePlayer === 3 && this.props.proposedValues[10]} score={this.props.playersNumber > 3 && this.props.score[3][10]} />
                        </tr>                                                                     
                        <tr>                                                                      
                            <td>Generał</td>                                                      
                            <TableValues player={0} mySeat={this.props.mySeat} setScore={this.props.setScore} value={11} proposedValue={this.props.activePlayer === 0 && this.props.proposedValues[11]} score={this.props.score[0][11]} />
                            <TableValues player={1} mySeat={this.props.mySeat} setScore={this.props.setScore} value={11} proposedValue={this.props.activePlayer === 1 && this.props.proposedValues[11]} score={this.props.score[1][11]} />
                            <TableValues player={2} mySeat={this.props.mySeat} setScore={this.props.setScore} value={11} proposedValue={this.props.activePlayer === 2 && this.props.proposedValues[11]} score={this.props.playersNumber > 2 && this.props.score[2][11]} />
                            <TableValues player={3} mySeat={this.props.mySeat} setScore={this.props.setScore} value={11} proposedValue={this.props.activePlayer === 3 && this.props.proposedValues[11]} score={this.props.playersNumber > 3 && this.props.score[3][11]} />
                        </tr>                                                                     
                        <tr>                                                                      
                            <td>Szansa</td>                                                       
                            <TableValues player={0} mySeat={this.props.mySeat} setScore={this.props.setScore} value={12} proposedValue={this.props.activePlayer === 0 && this.props.proposedValues[12]} score={this.props.score[0][12]} />
                            <TableValues player={1} mySeat={this.props.mySeat} setScore={this.props.setScore} value={12} proposedValue={this.props.activePlayer === 1 && this.props.proposedValues[12]} score={this.props.score[1][12]} />
                            <TableValues player={2} mySeat={this.props.mySeat} setScore={this.props.setScore} value={12} proposedValue={this.props.activePlayer === 2 && this.props.proposedValues[12]} score={this.props.playersNumber > 2 && this.props.score[2][12]} />
                            <TableValues player={3} mySeat={this.props.mySeat} setScore={this.props.setScore} value={12} proposedValue={this.props.activePlayer === 3 && this.props.proposedValues[12]} score={this.props.playersNumber > 3 && this.props.score[3][12]} />
                        </tr>
                        <tr>
                            <td>=</td>
                            <td>{this.props.score[0][14]}</td>
                            <td>{this.props.score[1][14]}</td>
                            <td>{this.props.playersNumber > 2 && this.props.score[2][14]}</td>
                            <td>{this.props.playersNumber > 3 && this.props.score[3][14]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Table;