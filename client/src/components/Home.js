import React, { Component } from 'react';
import Header from './Header';
import GamesList from './GameList';
import Footer from './Footer';

class Home extends Component {
    render() {
        return (
            <>
                <Header username={this.props.username}/>
                <GamesList />
                <Footer />
            </>
        );
    }
}

export default Home;