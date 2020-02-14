import React from 'react';
import {Route, Switch} from 'react-router-dom';
import SearchPage from 'modules/SearchPage';
import PlayerPage from 'modules/PlayerPage';

const App = () => {
    return (
        <Switch>
            <Route path="/player">
                <PlayerPage />
            </Route>
            <Route path="/" exact>
                <SearchPage />
            </Route>
        </Switch>
    );
}

export default App;
