//Strona g³ówna

import React, { Component } from 'react';
import TopBar from './TopBar';
import GamesList from './GameList';
import * as auth from '../nonUI/authMe';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secret: 'secret',
            players: 2
        }
        this.test = this.test.bind(this);
    }

    async test() {
        const res = await auth.authMe();
        this.setState({ secret: res.username });
    }

    render() {
        return (
            <>
                <TopBar/>
                <GamesList />
                <input type='button' value='test' onClick={this.test} />
                <p>{this.state.secret}</p>
            </>
        );
    }
}
export default Home;