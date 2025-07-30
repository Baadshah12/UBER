import React, { useState, useEffect } from 'react'
import { createContext } from 'react'

export const UserContextData = createContext()

const UserContext = ({children}) => {
    const [user, setUser] = useState(() => {
        // Try to load user from localStorage
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : {
            email: '',
            fullName: {
                firstName: '',
                lastName: ''
            }
        };
    });

    useEffect(() => {
        // Persist user to localStorage on change
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    return (
        <div>
            <UserContextData.Provider value={{ user, setUser }}>
                {children}
            </UserContextData.Provider>
        </div>
    )
}

export default UserContext