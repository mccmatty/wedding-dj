import {css} from '@emotion/core';

export default css`
    display: grid;
    grid-template-columns: 33% auto;
    grid-template-rows: auto;
    grid-template-areas: "player queue";

    .player {
        grid-area: player;
    }

    .queue {
        grid-area: queue;
    }
`;