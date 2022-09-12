import React, { Component } from 'react';
import buttonStyle from '../../css/button.module.css';

class CancelButton extends Component {
    render() {
        return (
            <div className={buttonStyle.cancel} onClick={this.props.hideForms}>
                <img src={'/placeholders/cancel.svg'} alt='przycisk anuluj¹cy zmiany' />
            </div>
        );
    }
}

export default CancelButton;