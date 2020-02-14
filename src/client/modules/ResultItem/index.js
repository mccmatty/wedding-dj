import React from 'react';
import styles from './styles';

export default ({image, title, itemId, children}) => {
    if (typeof title === 'string') {
        title = <p>{title}</p>
    }

    if (!image) {
        image = {
            src: ''
        }
    }

    return (
        <li css={styles}>
            <img src={image.url} height={48} width={48} />
            {title}
            {children && children(itemId)}
        </li>
    )
}