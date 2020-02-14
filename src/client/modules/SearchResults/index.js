import React from 'react';
import ArtistResults from 'modules/ArtistResults';
import AlbumResults from 'modules/AlbumResults';
import TrackResults from 'modules/TrackResults'
import {Link} from 'react-router-dom';

export default ({results: {artists, albums, tracks}}) => {
    return (
        <>
            {
                !!artists?.items?.length &&
                <>
                    <h2>Artists</h2>
                    <ArtistResults artists={artists?.items?.slice(0,2)} />
                    <Link to='/artistResults'>See All</Link>
                </>
            }
            {   
                !!albums?.items?.length &&
                <>
                    <h2>Albums</h2>
                    <AlbumResults albums={albums?.items?.slice(0,2)} />
                    <Link to='/albumResults'>See All</Link>
                </>
            }
            {
                !!tracks?.items?.length &&
                <>
                    <h2>Tracks</h2>
                    <TrackResults tracks={tracks?.items?.slice(0,2)} />
                    <Link to='/trackResults'>See All</Link>
                </>
            }
        </>
    )
}