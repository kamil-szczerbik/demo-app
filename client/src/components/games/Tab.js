import React, { Component } from 'react';

class Tab extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                onClick={() => this.props.handleClick(this.props.name)}
            >
                {this.props.name}
            </div>
        );
    }
}
export default Tab;