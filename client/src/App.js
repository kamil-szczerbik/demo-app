import React, { Component } from 'react';
import { BrowserRouter as Router, Route, /*Link,*/ Switch } from 'react-router-dom';
import Cookies from 'js-cookie';
import Home from './components/Home';
import Game from './components/games/Game';
import BoardsList from './components/boards/BoardsList';
import Profile from './components/profile/Profile';
import * as authentication from './nonUI/authenticateUser';
import './css/global.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };
    }

    componentDidMount() {
        this.authenticateUser();
    }

    async authenticateUser() {
        const response = await authentication.authenticateUser();
        if (response.status === 200) {
            const username = Cookies.get('username');
            this.setState({ username: username });
        }
    }

    render() {
        return (
/*BrowserRouter?*/
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/">
                            <Home username={ this.state.username }/>
                        </Route>
                        <Route path="/kosci/s" component={Game} />
                        <Route path="/kosci" component={BoardsList} />
                        <Route path='/profil' component={Profile} />
                        {/*<Route path="*" component={NotFound} albo 404*/}
                    </Switch>

                    {/*<Link to="/">Strona Główna</Link>
                    <Link to="/kosci">Stoły</Link>*/}
                </div>
            </Router>
        );
    }
}

export default App;