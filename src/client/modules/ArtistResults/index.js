import React from 'react';
import ResultItem from 'modules/ResultItem';

export default ({artists}) => {

    return (
        <ul>
            {artists.map(({id, name, images}) => {
                const [thumb] = images;

                return (
                    <ResultItem key={id} title={name} image={thumb} />
                );
            })}
        </ul>
    )
}
