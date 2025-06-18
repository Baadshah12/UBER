import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <div className='bg-cover bg-[center_top_-75px] bg-[url(https://plus.unsplash.com/premium_photo-1737012422783-590bdd55f7e6?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fHRyYWZmaWMlMjBzaWduYWx8ZW58MHx8MHx8fDA%3D)]   h-screen pt-8 flex justify-between flex-col w-full '>
            <img className='w-16 ml-8' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo"  />
            <div className='bg-white pb-7 py-4 px-4'>
                <h2 className='text-3xl font-bold'>Get Started with Uber</h2>
                <Link to="/login" className='flex items-center justify-center w-full font-bold bg-black text-white py-3 rounded-lg mt-5'>Continue</Link>
            </div>

        </div>
    </div>
  )
}

export default Home