import React from 'react';
import ResultItem from 'modules/ResultItem';

export default ({albums}) => {

    return (
        <ul>
            {albums.map(({id, name, images}) => {
                const [thumb] = images;

                return (
                    <ResultItem 
                        key={id}
                        itemId={id}
                        title={name} 
                        image={thumb}
                        baseUrl="album"
                    />
                );
            })}
        </ul>
    )
}
