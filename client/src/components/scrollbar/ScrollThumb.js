import React, { Component } from 'react';
import scrollStyle from '../../css/scroll.module.css';

class ScrollThumb extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thumbHeight: 236,
            thumbTop: 0,
            prevScrollTop: 0,
            isDragging: false,
            prevMousePositionY: 0
        };

        this.handleDragScrolling = this.handleDragScrolling.bind(this);
        this.stopDragScrolling = this.stopDragScrolling.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    componentDidMount() {
        this.calculateThumbPosition(this.props.scrollableElementRef.current.clientHeight, this.props.scrollableElementRef.current.scrollHeight, this.props.scrollableElementRef.current.scrollTop);
        this.calculateThumbHeight(this.props.scrollableElementRef.current.scrollHeight, this.props.scrollableElementRef.current.clientHeight);
    }

    componentDidUpdate(prevProps) {
        if (this.state.prevScrollTop !== this.props.scrollableElementRef.current.scrollTop)
            this.calculateThumbPosition(this.props.scrollableElementRef.current.clientHeight, this.props.scrollableElementRef.current.scrollHeight, this.props.scrollableElementRef.current.scrollTop);
        else if (this.props.alertsLength > prevProps.alertsLength)
            this.calculateThumbHeight(this.props.scrollableElementRef.current.scrollHeight, this.props.scrollableElementRef.current.clientHeight);
        else if (prevProps.newMessagesInfo === true && this.props.newMessagesInfo === false) {
            const newThumbTop = this.scrollToBottom(this.props.scrollableElementRef.current.scrollHeight, this.props.scrollableElementRef.current.clientHeight, this.state.thumbHeight);
            this.setState({ thumbTop: newThumbTop, prevScrollTop: this.props.scrollableElementRef.current.scrollTop });
        }
    }

    calculateThumbPosition(clientHeight, scrollHeight, scrollTop) {
        const thumbPercentage = clientHeight / scrollHeight;
        let newThumbTop = thumbPercentage * scrollTop;
        newThumbTop = Math.round(newThumbTop);
        this.setState({ thumbTop: newThumbTop, prevScrollTop: scrollTop });
    }

    calculateThumbHeight(scrollHeight, clientHeight) {
        const thumbPercentage = clientHeight / scrollHeight;
        let newThumbHeight = thumbPercentage * clientHeight;
        newThumbHeight = Math.max(Math.round(newThumbHeight), 10);

        const scrollAtBottom = this.checkScrollAtBottom();

        if (scrollAtBottom) {
            const newThumbTop = this.scrollToBottom(scrollHeight, clientHeight, newThumbHeight);
            this.setState({ thumbHeight: newThumbHeight, thumbTop: newThumbTop, prevScrollTop: this.props.scrollableElementRef.current.scrollTop });
        }
        else {
            this.props.showNewMessagesInfo();
            this.setState({ thumbHeight: newThumbHeight }); 
        }
    }

    checkScrollAtBottom() {
        if (this.state.thumbTop === this.props.scrollableElementRef.current.clientHeight - this.state.thumbHeight)
            return true;

        return false;
    }

    scrollToBottom(scrollHeight, clientHeight, thumbHeight) {
        const newScrollTop = scrollHeight - clientHeight;
        const newThumbTop = clientHeight - thumbHeight;

        this.props.scrollableElementRef.current.scrollTop = newScrollTop;
        return newThumbTop;
    }

    handleDragScrolling(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ isDragging: true, prevMousePositionY: e.clientY });
    }

    stopDragScrolling() {
        this.setState({ isDragging: false });
    }

    handleMouseMove(e) {
        if (this.state.isDragging) {
            e.preventDefault();
            e.stopPropagation();

            const scrollHeight = this.props.scrollableElementRef.current.scrollHeight;
            const clientHeight = this.props.scrollableElementRef.current.clientHeight;

            const deltaY = e.clientY - this.state.prevMousePositionY;
            const chatPercentage = scrollHeight / clientHeight;

            const newThumbTop = Math.min(Math.max(0, this.state.thumbTop + deltaY), clientHeight - this.state.thumbHeight);
            const newScrollTop = chatPercentage * deltaY;

            this.props.scrollableElementRef.current.scrollTop = Math.min(this.props.scrollableElementRef.current.scrollTop + newScrollTop, scrollHeight - clientHeight);
            this.setState({ thumbTop: newThumbTop, prevMousePositionY: e.clientY, prevScrollTop: newScrollTop });
        }
    }

    render() {
        return (
            <div
                className={scrollStyle.thumb}
                onMouseDown={this.handleDragScrolling}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.stopDragScrolling}
                onMouseLeave={this.stopDragScrolling}
                style={{
                    height: this.state.thumbHeight,
                    top: this.state.thumbTop
                }}
            >
            </div>
        );
    }
}

export default ScrollThumb;