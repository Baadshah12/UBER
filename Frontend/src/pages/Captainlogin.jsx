import React,{useState} from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';

const Captainlogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { captain, setCaptain } = React.useContext(CaptainDataContext);
    const navigate = useNavigate();


        const submitHandler = async (e) => {
            e.preventDefault();
           const captain = {
                email: email,
                password: password
            };
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain);
            if (response.status === 200) {
                const data = response.data;
                setCaptain(data.captain);
                localStorage.setItem('token', data.token);
                navigate('/captain-home');
            } else {
                console.error('Login failed');
            }
            setEmail('');
            setPassword('');
    } 
    return (
        <div className='p-7 flex flex-col justify-between h-screen'>
            <div>
                <img className='w-16 mb-10' src="https://pngimg.com/d/uber_PNG24.png" alt="Uber Logo" />
                <form onSubmit={(e) => submitHandler(e)}>
                    <h3 className='text-lg font-medium  mb-2'>What's your email?</h3>
                    <input type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' />
                    <h3 className='text-lg font-medium  mb-2'>What's your password?</h3>
                    <input type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' />
                    <button className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base'>Login</button>
            </form>
            <p className='text-center font-semibold'>Join a fleet? <Link to='/captain-signup' className='text-blue-600 px-1 underline'>Register as a Captain</Link></p>
        </div>
        <div>
            <Link to='/login' className='bg-[#d5622d] text-white flex items-center justify-center font-semibold mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base'>Sign in as User</Link>
        </div>
    </div>
  )
}

export default Captainlogin