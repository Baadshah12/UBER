
import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const socket = io(`${import.meta.env.VITE_BASE_URL}`);

const SocketProvider = ({ children }) => {
    // You can get userType and userId from localStorage, Redux, or props
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType'); // 'user' or 'captain'

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);

            // Emit join event
            if (userId && userType) {
                socket.emit('join', {
                    userId,
                    userType
                });
                console.log('Join event emitted:', { userId, userType });
            }
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    }, [userId, userType]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
