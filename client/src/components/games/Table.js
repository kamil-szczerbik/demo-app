import React, { Component } from 'react';
import tabStyle from '../../css/table.module.css';

class Table extends Component {
    render() {
        let upperSection = [];
        let upperSectionPart = [];
        let lowerSection = [];
        let lowerSectionPart = [];
        const categories = ['x3', 'x4', '3+2', 'M. Strit', 'D. Strit', 'Generał', 'Szansa'];

        for (let i = 0; i < 6; i++) {
            for (let k = 0; k < 4; k++) {
                if (k < 2) {
                    upperSectionPart[k] = <TableValues player={k} mySeat={this.props.mySeat} setScore={this.props.setScore} value={i} proposedValue={this.props.activePlayer === k && this.props.proposedValues[i]} score={this.props.score[k][i]} />
                    lowerSectionPart[k] = <TableValues player={k} mySeat={this.props.mySeat} setScore={this.props.setScore} value={i+5} proposedValue={this.props.activePlayer === k && this.props.proposedValues[i+5]} score={this.props.score[k][i+5]} />
                }
                else {
                    upperSectionPart[k] = <TableValues player={k} mySeat={this.props.mySeat} setScore={this.props.setScore} value={i} proposedValue={this.props.activePlayer === k && this.props.proposedValues[i]} score={this.props.playersNumber > k && this.props.score[k][i]} />
                    lowerSectionPart[k] = <TableValues player={k} mySeat={this.props.mySeat} setScore={this.props.setScore} value={i+5} proposedValue={this.props.activePlayer === k && this.props.proposedValues[i+5]} score={this.props.playersNumber > k && this.props.score[k][i+5]} />
                }
            }
            upperSection[i] =
                <tr>
                <td>{i + 1}</td>
                {upperSectionPart[0]}
                {upperSectionPart[1]}
                {upperSectionPart[2]}
                {upperSectionPart[3]}
                </tr>;
            lowerSection[i] =
                <tr>
                    <td>{categories[i]}</td>
                    {lowerSectionPart[0]}
                    {lowerSectionPart[1]}
                    {lowerSectionPart[2]}
                    {lowerSectionPart[3]}
                </tr>;
        }

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
                        {upperSection}
                        <tr>
                            <td>= (+)</td>
                            <td>{this.props.score[0][13]}</td>
                            <td>{this.props.score[1][13]}</td>
                            <td>{this.props.playersNumber > 2 && this.props.score[2][13]}</td>
                            <td>{this.props.playersNumber > 3 && this.props.score[3][13]}</td>
                        </tr>
                        {lowerSection}
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

class TableValues extends Component {
    render() {
        if (this.props.proposedValue !== false && this.props.proposedValue !== undefined && this.props.player === this.props.mySeat) {
            return (
                <td
                className={this.props.score !== null ? tabStyle.cellClicked : tabStyle.cell}
                value={this.props.value}
                onClick={(e) => { this.props.score === null && this.props.setScore(e)}}
                >
                    {this.props.score === null ? this.props.proposedValue : this.props.score}
                </td>
            )
        }
        else {
            return (
                <td className={this.props.score !== null ? tabStyle.cellClicked : tabStyle.cell3rd}>
                    {this.props.score === null ? this.props.proposedValue : this.props.score}
                </td>
            )
        }
    }
}

export default Table;