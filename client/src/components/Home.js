import React, { Component } from 'react';
import TopBar from './TopBar';
import GamesList from './GameList';
import Footer from './Footer';

class Home extends Component {
    render() {
        return (
            <>
                <TopBar />
                <GamesList />
                <Footer />
            </>
        );
    }
}

export default Home;