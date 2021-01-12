import React, { Component } from 'react';
import { Image } from 'react-konva';

class URLImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null
        };
        this.strokeEnable = true;
    }

    componentDidMount() {
        this.loadImage();
    }

    componentDidUpdate(oldProps) {
        this.imageNode.strokeEnabled(false);        //�eby po rerollu zaznaczone ko�ci, nie by�y wci�� zaznaczone
        this.strokeEnable = true;                   //�eby po rerollu ko�ci, kt�re by�y zaznaczone, a teraz nie s�, mo�na by�o zaznaczy�
        if (oldProps.src !== this.props.src) {
            this.loadImage();
        }

    }
/*
    shouldComponentUpdate(nextProps) {
        this.imageNode.strokeEnabled(false);
        this.strokeEnable = true;

        if (this.props.src !== nextProps.src)
            this.loadImage();

        return true;
    }*/

    componentWillUnmount() {
        this.image.removeEventListener('load', this.handleLoad);
    }

    loadImage() {
        // save to "this" to remove "load" handler on unmount
        this.image = new window.Image();
        this.image.src = this.props.src;
        this.image.addEventListener('load', this.handleLoad); // <--- tu jest ca�a przyczyna z�ego wczytywania
        //dopiero jak si� ca�a strona za�aduje to jest wywo�ywana funkcja z setstate i dopiero po setState jest update canvas
    }

    handleLoad = () => {
        // after setState react-konva will update canvas and redraw the layer
        // because "image" property is changed
        this.setState({
            image: this.image,
        });
        // if you keep same image object during source updates
        // you will have to update layer manually:
        // this.imageNode.getLayer().batchDraw();
    };

    render() {
        return (
            <Image
                x={this.props.x}
                y={this.props.y}
                image={this.state.image}
                width={this.props.width}
                height={this.props.height}
                offsetX={this.props.width / 2}
                offsetY={this.props.height / 2}
                rotation={this.props.rotation}

                ref={node => {
                    this.imageNode = node;
                }}

                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}

                onClick={e => {
                    if (this.props.canClick !== 2) {
                        this.imageNode.setAttrs(this.props.onClick(e)); //funckja onClick zwraca zestaw atrybut�w
                        this.imageNode.strokeEnabled(this.strokeEnable);
                        this.strokeEnable = !this.strokeEnable;
                        this.imageNode.getLayer().batchDraw(); //musi by� batchDraw
                    }
                }}
            />
        );
    }
}

export default URLImage;