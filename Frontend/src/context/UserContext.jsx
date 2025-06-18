import React,{useState} from 'react'
import { createContext } from 'react'

export const UserContextData = createContext()

const UserContext = ({children}) => {
    const[user, setUser] = useState({
        email: '',
        fullName: {
            firstName: '',
            lastName: ''
        }
    })

    return (
        <div>
            <UserContextData.Provider value={{ user, setUser }}>
                {children}
            </UserContextData.Provider>
        </div>
  )
}

export default UserContext