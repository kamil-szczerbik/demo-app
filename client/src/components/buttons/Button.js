import React, { Component } from 'react';
import buttonStyle from '../../css/button.module.css';

class Button extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let className;
        if (this.props.className === 'affirmative')
            className = 'affirmative';
        else
            className = 'dismissive';

        return (
            <button
                className={buttonStyle[className]}
                type='button'
                disabled={this.props.disabled}
                onClick={this.props.action}
            >
                {this.props.text}
            </button>
        );
    }
}

export default Button;