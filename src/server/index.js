import Hapi from '@hapi/hapi';
import Vision from '@hapi/vision';
import Inert from '@hapi/inert';
import handlebars from 'handlebars';
import {ApolloServer, PubSub} from 'apollo-server-hapi';
import App from '../client/App';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SpotifyClient from './clients/spotifyClient';
import RedisClient from './clients/redisClient';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from '@apollo/react-hooks';
import {createHttpLink} from 'apollo-link-http';
import {InMemoryCache} from "apollo-cache-inmemory";
import fetch from 'node-fetch';
import {StaticRouter} from 'react-router';
import dotenv from 'dotenv';
import redis from 'redis';

dotenv.config();

const spotifyClient = new SpotifyClient(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_SECRET, process.env.PLAYLIST_ID);
const redisClient = RedisClient.getInstance();

const pubsub = new PubSub();
const QUEUE_UPDATED = 'QUEUE_UPDATED';

const client = new ApolloClient({
    link: createHttpLink({
      uri: '/api',
      fetch
    }),
    cache: new InMemoryCache(),
});

const typeDefs = `
    type Query {
        searchMusic(query: String!): SearchResults
        getQueue: Queue
        getArtist(id: String!): Artist
        getAlbum(id: String!): Album
    },

    type Mutation {
        addTrack(trackId: String): String
    },

    type Subscription {
        queueUpdated: Queue
    }

    type Queue {
        items: [QueueItem]
    }

    type SearchResults {
        artists: ArtistList
        albums: AlbumList
        tracks: TrackList
    },
    type ArtistList {
        items: [Artist]
        limit: Int
        offset: Int
        total: Int
    },
    type TrackList {
        items: [Track]
        limit: Int
        offset: Int
        total: Int
    },
    type AlbumList {
        items: [Album]
        limit: Int
        offset: Int
        total: Int
    },
    type Artist {
        id: String
        images: [Image]
        name: String
        albums: AlbumList
        tracks: TrackList
    },
    type Track {
        id: String
        name: String
        album: Album
        duration: Int
    },
    type Album {
        id: String
        images: [Image]
        name: String
        tracks: TrackList
    }
    type Image {
        height: Int
        width: Int
        url: String
    }
    type QueueItem {
        id: String
        track: Track
        votes: Int
    }
`;

const resolvers = {
    Query: {
        searchMusic: (_root, {query}) => {
            return spotifyClient.search(query);
        },
        getQueue: () => {
            return spotifyClient.getPlaylist();
        },
        getArtist: (_root, {id}) => {
            return spotifyClient.getArtist(id);
        },
        getAlbum: (_root, {id}) => {
            return spotifyClient.getAlbum(id);
        }
    },
    Mutation: {
        addTrack: async (_root, {trackId}, context) => {
            const playlist = await spotifyClient.addTrack(trackId);
            let voteCount = await redisClient.get(trackId);

            if (!voteCount) {
                voteCount = 0
            }

            await redisClient.set(trackId, ++voteCount);
            const updated = await redisClient.get(trackId);
            console.log(`VOTES FOR TRACK ${trackId}: ${updated}`);

            pubsub.publish(QUEUE_UPDATED, {queueUpdated: playlist})
            return null
        }
    },
    Subscription: {
        queueUpdated: {
            subscribe: () => pubsub.asyncIterator([QUEUE_UPDATED])
        }
    },
    Artist: {
        albums(_root) {
            return spotifyClient.getArtistAlbums(_root.id);
        },
        tracks(_root) {
            return spotifyClient.getArtistTracks(_root.id);
        }
    }
};

const getContentBody = (req) => {
    const AppContainer = (
        <ApolloProvider client={client}>
            <StaticRouter location={{pathname: req.path}} context={{}}>
                <App />
            </StaticRouter>
        </ApolloProvider>
    )

    return ReactDOMServer.renderToString(AppContainer);
}


const startServer = async () => {

    const apolloServer = await new ApolloServer({
        typeDefs, 
        resolvers,
        context: (req) => req,
        subscriptions: {
            onConnect: () => {
                console.log('subscription connection');
            },
            onDisconnect: () => {
                console.log('subscription disconnection');
            }
        }
    });

    const server = new Hapi.server({
        host: 'localhost',
        port: 3000
    });

    server.auth.scheme('spotify', (server, {clientId}) => {
        const redirect = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=http://localhost:8080/auth/&response_type=code&scope=playlist-read-private playlist-modify-private streaming user-read-email user-read-private`

        return {
            authenticate: (req, h) => {
                if (!spotifyClient.userToken) {
                    return h.redirect(redirect).takeover()
                }
                return h.authenticated({credentials: {}})
            }
        }
    });

    server.auth.strategy('spotify', 'spotify', {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_SECRET
    })
/*
    const io = socketIo(server.listener);

    io.on('connection', function(socket){
        socket.on('songRequest', async (message) => {
            console.log('SONG REQUEST', message);
            const track = await spotifyClient.getTrackById(message);
            socket.broadcast.emit('songRequest', track);
        })
    });
*/
    await server.register(Vision);
    await server.register(Inert);

    server.views({
        engines: { hbs: handlebars },
        relativeTo: __dirname,
        path: 'templates'
    });

    server.route([{
        method: 'GET',
        path: '/build/{param*}',
        handler: {
            directory: {
                path: './buld',
                redirectToSlash: true,
                index: true,
            }
        }
    },{
        method: ['GET', 'POST'],
        path: '/auth/',
        handler: async (req, h) => {
            const token = await spotifyClient.getUserAccessToken(req.query.code);
            return h.response().redirect('/player')
        }
    },
    {
        path: '/{rest*}',
        method: 'GET',
        options: {
            auth: 'spotify',
            handler: (req, h) => { 
                return h
                    .view('index', {body: getContentBody(req)})
                    .state('spotify_jwt', spotifyClient.userToken, {isSecure: false, isHttpOnly: false});
            }
        }
    }])

    apolloServer.applyMiddleware({
        app: server
    });


console.log('about to attach subscription handlers')
try {
    apolloServer.installSubscriptionHandlers(server.listener);
} catch (e) {
    console.log('no handlers')
}
    try {
        await spotifyClient.getAccessToken();
    } catch (e) {
        console.log('there was an error fetching spotify token', e);
    }
    await server.start();
    console.log(`server running at: ${server.info.uri}`);
}

startServer();