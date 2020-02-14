import React, {useState, useEffect} from 'react';
import Player from 'modules/Player'
import PlayerQueue from 'modules/PlayerQueue';
import styles from './styles';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';

const QUEUE_QUERY = gql`
query getQueue {
    getQueue {
        items {
            track {
                id
                name
                album {
                    name
                    images {
                        url
                    }
                }
            }
        }
    }
}
`

const QUEUE_SUBSSCRIPTION = gql`
    subscription queueUpdated {
        queueUpdated {
            items {
                track {
                    id
                    name
                }
            }
        }
    }
`

const PlayerPage = () => {
    const {data} = useQuery(QUEUE_QUERY);
    const [currentTrack, updateCurrentTrack] = useState();
    const [tracks, updateTracks] = useState([]);
    let nextTrack = () => {};

    useEffect(() => {
        const queue = data?.getQueue.items.map(({track}) => track) ?? [];
        const [first, ...rest] = queue;
        updateCurrentTrack(first);
        updateTracks(rest);
    }, [data]);

    nextTrack = () => {  
        let nextTrack;
        let remainingTracks;

        updateTracks((tracks) => {
            [nextTrack, ...remainingTracks] = tracks;
            return remainingTracks;
        });

        updateCurrentTrack(nextTrack);
    }

    return (
        <div css={styles}>
            <Player track={currentTrack} onTrackEnd={() => nextTrack()}/>
            <PlayerQueue queue={tracks} />
        </div>
    )
}

export default PlayerPage;