import React from 'react';
import {useHistory} from 'react-router-dom';
import styles from './styles';


export default () => {
    const history = useHistory();

    const goBack = (e) => {
        e.preventDefault();
        history.goBack();
    }

    return (
        <div css={styles.toolbar}>
            <a onClick={goBack}  css={styles.back}>{'< back'}</a>
        </div>
    )
}