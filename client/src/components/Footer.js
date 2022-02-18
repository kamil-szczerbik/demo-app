import React, { Component } from 'react';
import globalStyle from '../css/global.module.css';

class Footer extends Component {
    render() {
        return (
            <div className={globalStyle.footer}>
                <p>&copy; 2022 Wszystkie prawa zastrzeżone!</p>
                <p>v0.52.1</p>
            </div>
        );
    }
}

export default Footer;