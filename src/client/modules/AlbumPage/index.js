import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {useParams} from 'react-router-dom'
import {page, heroImage} from 'common/styles/layout';
import albumQuery from './albumQuery.graphql';
import Toolbar from 'modules/Toolbar';
import TrackResults from '../TrackResults';

const AlbumPage = () => {
    const {id} = useParams();
    const {data, loading} = useQuery(albumQuery, {variables: {id}})

    if (loading) {
        return <div css={page} />
    }

    const {getAlbum: album} = data;
    const {images: [image]} = album

    return (
        <div css={page}>
            <Toolbar />
            <img alt={`The album ${album.name}`} src={image.url} css={heroImage} />
            <h1>{album.name}</h1>
            <TrackResults tracks={album?.tracks?.items ?? []} />
        </div>
    );
};

export default AlbumPage;