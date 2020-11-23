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
            players: 2,
            dupa: ''
        }
        this.test = this.test.bind(this);
    }

    async test() {
        const res = await auth.authMe();
        this.setState({ secret: res.username });
    }

    componentDidMount() {

        let duration = 300;
        let timer = duration;
        let minutes;
        let seconds;

        setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            this.setState({ dupa: minutes + ':' + seconds });

            if (--timer < 0) {
                timer = duration;
            }
        }, 1000);
    }     

    render() {
        return (
            <>
                <TopBar />
                <GamesList />
                <p>{this.state.dupa}</p>
                <input type='button' value='test' onClick={this.test} />
                <p>{this.state.secret}</p>
            </>
        );
    }
}
export default Home;