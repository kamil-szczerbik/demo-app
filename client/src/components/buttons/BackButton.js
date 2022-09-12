import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import buttonStyle from '../../css/button.module.css';

class BackButton extends Component {
    constructor(props) {
        super(props);

        this.redirectHome = this.redirectHome.bind(this);
	}

    redirectHome() {
        this.props.history.goBack();
    }

    render() {
        return (
            <div className={buttonStyle.back} onClick={this.redirectHome}>
                <img src={'/placeholders/back.svg'} alt='przycisk powrotu na stronê g³ówn¹' />
            </div>
        );
    }
}

export default withRouter(BackButton);