import React from 'react';
import {Route, Switch, useLocation} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import SearchPage from 'modules/SearchPage';
import QueuePage from 'modules/QueuePage';
import PlayerPage from 'modules/PlayerPage';
import ArtistPage from 'modules/ArtistPage';
import AlbumPage from 'modules/AlbumPage';

const App = () => {
    const location = useLocation();

    return (
        <TransitionGroup>
            <CSSTransition
                key={location.key}
                classNames="slide"
                timeout={400}        
            >
                <Switch location={location}>
                    <Route path="/artist/:id" exact>
                        <ArtistPage />
                    </Route>
                    <Route path="/album/:id" exact>
                        <AlbumPage />
                    </Route>
                    <Route path="/player" exact>
                        <PlayerPage />
                    </Route>
                    <Route path="/queue" exact>
                        <QueuePage />
                    </Route>
                    <Route path="/">
                        <SearchPage />
                    </Route>
                </Switch>
            </CSSTransition>
        </TransitionGroup>
    );
}

export default App;
