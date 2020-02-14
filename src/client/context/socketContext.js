import React from 'react';

const context = React.createContext();

export const SocketContext = context;
export const SocketConsumer = SocketContext.Consumer;
export const SocketProvider = SocketContext.Provider;

export default {
    SocketContext,
    SocketProvider,
    SocketConsumer
}