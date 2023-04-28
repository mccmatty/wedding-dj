import React from 'react';
import Player from 'modules/Player'
import PlayerQueue from 'modules/PlayerQueue';
import styles from './styles';
import useTrackList from 'common/hooks/useTrackList';

const PlayerPage = () => {
    
    const {tracks, currentTrack, nextTrack} = useTrackList();

    return (
        <div css={styles}>
            <Player track={currentTrack} onTrackEnd={nextTrack}/>
            <PlayerQueue queue={tracks} />
        </div>
    )
}

export default PlayerPage;