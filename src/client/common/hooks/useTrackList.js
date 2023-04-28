import {useState, useEffect} from 'react';
import {useQuery, useSubscription} from '@apollo/react-hooks';
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

export default () => {
    const {data} = useQuery(QUEUE_QUERY);
    const {data:updates} = useSubscription(QUEUE_SUBSSCRIPTION)
    const [currentTrack, updateCurrentTrack] = useState();
    const [tracks, updateTracks] = useState([]);

    useEffect(() => {
        const queue = data?.getQueue.items.map(({track}) => track) ?? [];
        const [first, ...rest] = queue;
        updateCurrentTrack(first);
        updateTracks(rest);
    }, [data]);

    useEffect(() => {
        const queue = updates?.queueUpdated.items.map(({track}) => track) ?? [];
        const [first, ...rest] = queue;
        updateCurrentTrack(first);
        updateTracks(rest);
    }, [updates]);

    const nextTrack = () => {  
        let next;
        let remainingTracks;

        updateTracks((tracks) => {
            [next, ...remainingTracks] = tracks;
            return remainingTracks;
        });

        updateCurrentTrack(next);
    }

    return {tracks, currentTrack, nextTrack}
}