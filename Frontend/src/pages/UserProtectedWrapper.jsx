import React,{useContext,useEffect,useState} from 'react'
import { UserContextData } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContextData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((response) => {
    setUser(response.data);
    setIsLoading(false);
  }).catch((error) => {
    console.error('Error fetching user profile:', error);
    localStorage.removeItem('token');
    navigate('/login');
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return ( 
    <>{children}</>
  );
}


export default UserProtectedWrapper