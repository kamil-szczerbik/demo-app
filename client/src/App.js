import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom';

import Home from './components/Home';
import Game from './components/games/Game';
import BoardsList from './components/boards/BoardsList';
import * as logout from './nonUI/logoutMe';
import './css/global.css';

class App extends Component {
    componentDidMount() {
        if (localStorage.getItem('username') === null) {
            logout.logoutMe();
        }
    }

    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/kosci/s" component={Game} />
                        <Route path="/kosci" component={BoardsList} />
                    </Switch>

                    <Link to="/">Strona Główna</Link>
                    <Link to="/kosci">Stoły</Link>
                </div>
            </Router>
        );
    }
}

export default App;