import React, { Component } from 'react';
import ScrollThumb from './ScrollThumb';
import scrollStyle from '../../css/scroll.module.css';

class Scrollbar extends Component {
    render() {
        return (
            <div
                className={scrollStyle.container}
                style={{ opacity: this.props.hovering ? 1 : 0 }}
            >
                <ScrollThumb
                    alertsLength={this.props.alertsLength}
                    newMessagesInfo={this.props.newMessagesInfo}
                    scrollableElementRef={this.props.scrollableElementRef}
                    showNewMessagesInfo={this.props.showNewMessagesInfo}
                />
            </div>
        );
    }
}

export default Scrollbar;