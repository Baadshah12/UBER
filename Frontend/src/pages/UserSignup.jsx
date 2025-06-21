import React,{useState,useContext} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'
import {UserContextData} from '../context/userContext';

const UserSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();
    const { user,setUser } = useContext(UserContextData);

    const submitHandler = async(e) => {
        e.preventDefault();
        const newUser = {
            fullname:{
                firstname: firstName,
                lastname: lastName
            },
            email: email,
            password: password
        }

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

        if (response.status === 201) {
            const data = response.data;
            setUser(data.user);
            localStorage.setItem('token', data.token); // Store user data in localStorage
            navigate('/home');
        } else {
            console.error('Registration failed');
        }

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
    }
  return (
    <div  className='p-7 flex flex-col justify-between h-screen'>
        <div>
            <img className='w-16 mb-10' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo"  />
            <form onSubmit={(e) => submitHandler(e)}>
                <h3 className='text-lg font-medium  mb-2'>What's your name?</h3>
                <div  className='flex gap-4 mb-6'>
                    <input type="text" placeholder="First name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className='bg-[#eeeeee]  rounded px-4 py-2 border w-1/2  text-lg placeholder:text-base' />
                    <input type="text" placeholder="Last name" required value={lastName} onChange={(e) => setLastName(e.target.value)} className='bg-[#eeeeee]  rounded px-4 py-2 border w-1/2  text-lg placeholder:text-base' />
                </div>
                <h3 className='text-lg font-medium  mb-2'>What's your email?</h3>
                <input type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base' />
                <h3 className='text-lg font-medium  mb-2'>Enter Password</h3>
                <input type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base' />
                <button className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base'>Create Account</button>
            </form>
            <p className='text-center font-semibold'>Already have an account? <Link to='/login' className='text-blue-600 px-1 underline'>Login Here</Link></p>
        </div>
        <div>
            <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>
    </div>
  )
}

export default UserSignup