import React from 'react';
import {useSubscription} from '@apollo/react-hooks';
import gql from 'graphql-tag';



const PlayerQueue = ({queue}) => {
    //const {data} = useSubscription(QUEUE_SUBSSCRIPTION);
    //console.log(`DATA`, data);
    //const {items = []} = data?.queueUpdated ?? {};

    return (
        <div className="queue">
            <h2>Up Next: </h2>
            <ul>
            {queue.map(({id, name}) => (
                <li key={id}>{name}</li>
            ))}
            </ul>
        </div>
    )
}

export default PlayerQueue;
