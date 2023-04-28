import {css} from '@emotion/core';

export const page = css`
    height: 100vh;
    width: 100vw;
    display: inline-block;
    position: absolute;
    top: 0;
    background-color: #282c34;
`;

export const heroImage = css`
    width: 100vw;
    height: 33%;
    object-fit: cover;
    object-position: center top;
`;

export const scroll = css`
    overflow-y: scroll;
`

export default {
    page,
    heroImage,
    scroll
};