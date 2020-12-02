import React, { Component } from 'react';
import globalStyle from '../css/global.module.css';

class Footer extends Component {
    render() {
        return (
            <div className={globalStyle.footer}>
                <h3>&copy; 2020 Wszystkie prawa zastrzeżone!</h3>
            </div>
        );
    }
}
export default Footer;