import React from 'react';
import styles from './styles';

export default ({searchMusic, searchTerm}) => {
    return (
        <input 
            css={styles}
            placeholder="Search Tracks, Artists, Albums"
            type="text"
            value={searchTerm}
            onChange={({target: {value}}) => searchMusic(value)}
        />
    )
}