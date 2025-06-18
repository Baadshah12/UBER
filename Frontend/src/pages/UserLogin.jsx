import React,{useState} from 'react'
import { Link } from 'react-router-dom'

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userData, setUserData] = useState({});

    const submitHandler = (e) => {
        e.preventDefault();
        setUserData({
            email: email,
            password: password
        });
        setEmail('');
        setPassword('');
    }

  return (
    <div  className='p-7 flex flex-col justify-between h-screen'>
        <div>
            <img className='w-16 mb-10' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo"  />
            <form onSubmit={(e) => submitHandler(e)}>
                <h3 className='text-lg font-medium  mb-2'>What's your email?</h3>
                <input type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' />
                <h3 className='text-lg font-medium  mb-2'>What's your password?</h3>
                <input type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' />
                <button className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base'>Login</button>
            </form>
            <p className='text-center font-semibold'>New here? <Link to='/signup' className='text-blue-600 px-1 underline'>Create new Account</Link></p>
        </div>
        <div>
            <Link to='/captain-login' className='bg-[#10b461] text-white flex items-center justify-center font-semibold mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base'>Sign in as Captain</Link>
        </div>
    </div>
  )
}

export default UserLogin