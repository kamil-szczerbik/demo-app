import React, { Component } from 'react';
import buttonStyle from '../../css/button.module.css';

class SaveButton extends Component {
    render() {
        return (
            <div className={buttonStyle.save} onClick={this.props.handleData}>
                <img src={'/placeholders/save3.svg'} alt='przycisk zapisuj�cy zmiany' />
            </div>
        );
    }
}

export default SaveButton;