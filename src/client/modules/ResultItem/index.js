import React from 'react';
import {Link} from 'react-router-dom';
import styles from './styles';

export default ({image, index, title, itemId, baseUrl, children}) => {
    if (typeof title === 'string') {
        title = <p>{title}</p>
    }

    if (!image) {
        image = {
            src: ''
        }
    }

    const item = (
        <li css={styles}>
            {
                !index &&
                <img src={image.url} height={48} width={48} />
            }
            {
                index &&
                <span>{index}</span>
            }
            {title}
            {children && children(itemId)}
        </li>
    );
    
    if (baseUrl){
        return (
            <Link to={`/${baseUrl}/${itemId}`}>
                {item}
            </Link>
        );
    }

    return item;
    
}