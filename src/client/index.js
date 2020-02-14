import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import './globals.css'
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from '@apollo/react-hooks';
import {split} from 'apollo-link';
import {WebSocketLink} from 'apollo-link-ws';
import {HttpLink} from 'apollo-link-http';
import {getMainDefinition} from 'apollo-utilities';
import {InMemoryCache} from "apollo-cache-inmemory";
import {SocketContext} from 'context/socketContext';
import io from 'socket.io-client';
/*
const socket = io();
socket.on('connect', () => {
    
});
*/
const httpLink = new HttpLink({
    uri: '/graphql'
});

const wsLink = new WebSocketLink({
    uri: 'ws://localhost:3000/graphql'
})

const link = split(
    ({query}) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink
)

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});


//console.log(socket);


const AppContainer = (
    <SocketContext.Provider value={{on: () => {}}}>
        <ApolloProvider client={client}>
            <Router>
                <App />
            </Router>
        </ApolloProvider>
    </SocketContext.Provider>
);

ReactDOM.hydrate(AppContainer, document.getElementById('root'));
