import React, {useState, useEffect} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import SearchBar from 'modules/SearchBar';
import SearchResults from 'modules/SearchResults';
import searchQuery from './searchQuery.graphql';
import {page} from 'common/styles/layout';
import debounce from 'debounce';

console.log(page);

export default () => {
    const [term, updateTerm] = useState('');
    const [getResults, {loading, data}] = useLazyQuery(searchQuery, {
        variables: {query: term},
        skip: true
    })
    const debounceResults = debounce(getResults, 1000);

    const searchMusic = (term) => {
        updateTerm(term);
        !!term && debounceResults();
    }

    return (
        <div css={page}>
            <SearchBar
                searchTerm={term}
                searchMusic={searchMusic}
            />
            {
                !loading && data && (
                    <SearchResults results={data.searchMusic} />
                )
            }
        </div>
    )
}