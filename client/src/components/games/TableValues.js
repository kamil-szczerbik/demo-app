import React, { Component } from 'react';
import tabStyle from '../../css/table.module.css';

class TableValues extends Component {
    render() {

        if (this.props.proposedValue !== false && this.props.proposedValue !== undefined && this.props.player === this.props.mySeat) {
            return (
                <td
                    className={this.props.score !== null ? tabStyle.cellClicked : tabStyle.cell}
                    value={this.props.value}
                    onClick={() => this.props.score === null && this.props.addPoints(this.props.value)}
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

export default TableValues;