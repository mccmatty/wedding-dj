
import React, {useEffect} from 'react';
import SpotifyPlayer from './helpers/spotifyPlayer';

const spotifyPlayer = new SpotifyPlayer();

const Player = ({track, onTrackEnd}) => {

    useEffect(() => {
        spotifyPlayer.play();
        spotifyPlayer.on('trackEnd', onTrackEnd)
    }, []);
    
    return (
        <div className="player">
            <h2>Now Playing</h2>
            <img src={track?.album.images[0].url} height={500} width={500} />
            <p><strong>{track?.name}</strong></p>
            <p>{track?.album.name}</p>
        </div>
    )
};

export default Player;