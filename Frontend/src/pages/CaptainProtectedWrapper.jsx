import React,{useContext,useEffect, useState} from 'react'
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainProtectedWrapper = ({ children }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
        navigate('/captain-login');
        }
    }, [token]);
    
    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        setCaptain(response.data.captain);
        setIsLoading(false);
    }).catch((error) => {
        console.error('Error fetching captain profile:', error);
        localStorage.removeItem('token');
        navigate('/captain-login');
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return ( 
        <>{children}</>
    );
}

export default CaptainProtectedWrapper