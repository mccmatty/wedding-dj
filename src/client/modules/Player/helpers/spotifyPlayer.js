
import EventEmitter from 'events';
import Cookie from 'js-cookie';

class SpotifyPlayer extends EventEmitter {
    token = null;
    player =  null;
    deviceId = null;
    playlistId = '2pCdhLfB8WHIuHQyjF97W1';

    constructor() {
        super();

        if (typeof window !== 'undefined'){
            this.token = Cookie.get('spotify_jwt');
            console.log('token', this.token);
            window.onSpotifyWebPlaybackSDKReady = () => {
                this.player = new Spotify.Player({
                    name: 'Web Playback SDK Quick Start Player',
                    getOAuthToken: cb => { cb(this.token); }
                });

                this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
                this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
                this.player.addListener('account_error', ({ message }) => { console.error(message); });
                this.player.addListener('playback_error', ({ message }) => { console.error(message); });
                this.player.addListener('player_state_changed', this.playerStateChange.bind(this))

                this.player.addListener('ready', ({device_id}) => {
                    console.log('THE DEVICE ID IS READY')
                    this.deviceId = device_id;
                });

                this.player.connect();
                
            }
        }
    }

    play() {
        if (!this.deviceId) {
            setTimeout(() => {console.log('checking deviceID'); this.play()}, 100);
            return
        }

        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
            method: 'PUT',
            body: JSON.stringify({context_uri: `spotify:playlist:${this.playlistId}`}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
    }

    playerStateChange(state) {
        const currentTrack = state.track_window.current_track.id;
        const previousTrack = this.previousState?.track_window.current_track.id;

        if (previousTrack && previousTrack !== currentTrack) {
            console.log('emitting track end');
            this.emit('trackEnd')
        }

        this.previousState = state;
    }
}

export default SpotifyPlayer;