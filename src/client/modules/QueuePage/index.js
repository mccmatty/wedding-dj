import React from 'react';
import PlayerQueue from 'modules/PlayerQueue';
import useTrackList from 'common/hooks/useTrackList';
import {page} from 'common/styles/layout';

const ArtistPage = () => {
    const {tracks} = useTrackList();

    return (
        <div css={page}>
            <PlayerQueue queue={tracks} />
        </div>
    );
};

export default ArtistPage;