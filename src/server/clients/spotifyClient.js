import Wreck from '@hapi/wreck';
import QueryString from 'querystring';

class SpotifyClient {
    static TOKEN_URL = 'https://accounts.spotify.com/api/token';
    static SEARCH_URL = 'https://api.spotify.com/v1/search';
    static TRACK_URL = 'https://api.spotify.com/v1/tracks';
    static PLAYLIST_URL = 'https://api.spotify.com/v1/playlists';

    constructor(clientId, secret, playlistId) {
        this.clientId = clientId;
        this.secret = secret;
        this.playlistId = playlistId;
    }

    async getAccessToken() {
        const credentials = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_SECRET}`;
        const buffer = new Buffer(credentials);
        const auth = buffer.toString('base64');

        try {
            const {payload: response} = await Wreck.post(SpotifyClient.TOKEN_URL, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'authorization': `Basic ${auth}`,
                    'accept': 'application/json'
                },
                payload: QueryString.stringify({
                    'grant_type': 'client_credentials'
                })
            })

            const payload = JSON.parse(response.toString());
             this.token = payload.access_token;
        } catch (e) {
            console.log('There was an error requesting access token', e);
        }
    }

    async search(query) {
        const params = QueryString.stringify({
            q: query,
            type: 'album,artist,track'
        });

        const {payload: response} = await Wreck.get(`${SpotifyClient.SEARCH_URL}?${params}`, {
            headers: {
                authorization: `Bearer ${this.token}`
            }
        })

        return JSON.parse(response.toString());
    }

    async getTrackById(id) {
        const {payload: response} = await Wreck.get(`${SpotifyClient.TRACK_URL}/${id}`, {
            headers: {
                authorization: `Bearer ${this.token}`
            }
        });

        return JSON.parse(response.toString());
    }

    async getPlaylist() {

        try {
            const {payload: response} = await Wreck.get(
                `${SpotifyClient.PLAYLIST_URL}/${this.playlistId}/tracks`,
                {
                    headers: {
                        'authorization': `Bearer ${this.userToken}`,
                    }
                }
            );

            return JSON.parse(response.toString());
        } catch (e) {
            console.log('Error getting playlist', e);
        }

    }

    async addTrack(id) {
        try {
            const response = await Wreck.post(
                `${SpotifyClient.PLAYLIST_URL}/${this.playlistId}/tracks`, 
                {
                    headers: {
                        'authorization': `Bearer ${this.userToken}`,
                        'content-type': `application/json`
                    },
                    payload: {
                        uris: [`spotify:track:${id}`]
                    }
                }
            )
        } catch (e) {
            console.log(e)
        }

        
        return this.getPlaylist()
    }

    async getUserAccessToken(code) {
        const credentials = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_SECRET}`;
        const buffer = new Buffer(credentials);
        const auth = buffer.toString('base64');


        const queryString = QueryString.stringify({
            'client_id': this.clientId,
            'client_secret': this.secret,
            'grant_type': 'authorization_code',
            'redirect_uri': 'http://localhost:8080/auth/',
            code
        });

        console.log(queryString)

        try {
            const {payload: response} = await Wreck.post(SpotifyClient.TOKEN_URL, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json'
                },
                payload: queryString
            });

            const payload = JSON.parse(response.toString());
             this.userToken = payload.access_token;

             return payload.access_token;
        } catch (e) {
            console.log('ERROR GETTING TOKEN', e);
        }
    }
}

export default SpotifyClient;