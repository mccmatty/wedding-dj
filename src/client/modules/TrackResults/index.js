import React, {useContext} from 'react';
import {useMutation} from '@apollo/react-hooks'
import ResultItem from 'modules/ResultItem';
import {SocketContext} from 'context/socketContext'
import gql from 'graphql-tag';

const ADD_TRACK = gql`
    mutation addTrack($trackId: String!) {
        addTrack(trackId: $trackId)
    }
`

const RequestTrackButton = ({trackId}) => {
    const [requestSong] = useMutation(ADD_TRACK, {
        variables: {
            trackId
        }
    })

    const socket = useContext(SocketContext);

    const changeSong = () => {
        socket.emit('songRequest', trackId)
    }

    return (<button onClick={requestSong}>Request Song</button>)
}

export default ({tracks}) => {

    return (
        <ul>
            {tracks.map(({id, name, album: {images}}) => {
                const [thumb] = images;

                return (
                    <ResultItem 
                        key={id} 
                        title={name} 
                        image={thumb} 
                        itemId={id}
                    >
                        {(itemId) => (
                            <RequestTrackButton trackId={itemId} />
                        )}
                    </ResultItem>
                );
            })}
        </ul>
    )
}
