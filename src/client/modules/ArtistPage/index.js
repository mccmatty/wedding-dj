import React from 'react';
import Toolbar from 'modules/toolbar';
import AlbumResults from 'modules/AlbumResults';
import {useParams} from 'react-router-dom';
import {useQuery} from '@apollo/react-hooks'
import {page, scroll, heroImage} from 'common/styles/layout';
import artistQuery from './artistQuery.graphql';

const ArtistPage = () => {
    const {id} = useParams();
    const {data, loading} = useQuery(artistQuery, {variables: {id}});

    if (loading) {
        return <div css={page} />
    }

    const {getArtist: artist} = data;
    const {images:[image]} = artist;

    return (
        <div css={page}>
            <Toolbar />
            <img alt={`The artist ${artist.name}`} src={image.url} css={heroImage} />
            <h1>{artist.name}</h1>
            <div css={scroll}>
                <AlbumResults albums={artist?.albums?.items ?? []} />
            </div>
        </div>
    );
};

export default ArtistPage;