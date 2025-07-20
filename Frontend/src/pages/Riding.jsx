import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {useEffect,useContext} from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Riding = () => {
  const location = useLocation();
  const ride = location.state?.ride;
  const {socket} = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(()=>{
    socket.on('ride-finished',()=>{
      navigate('/home');
    })
  })

  return (
    <div className='h-screen'>
        <Link to='/home' className='fixed right-2 top-2  h-10 w-10 bg-white flex items-center justify-center rounded-full'>
            <i className=' text-lg font-medium ri-home-5-line'></i>
        </Link>
        <div className='h-[50%]'>
            <LiveTracking height='50vh' />
        </div>
        <div className='h-[50%] p-4 '>
            <div className='flex items-center justify-between '>
        <img className='h-16 '   src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_552,w_552/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d80a9c47/original/Final_UberX.png" alt="" />
        <div className='text-right' >
            <h2 className='text-lg font-medium  p-2'>{ride?.captain?.fullname?.firstname} {ride?.captain?.fullname?.lastname}</h2>
            <h4 className='text-xl font-semibold -mt-2 -mb-1 p-2'>{ride?.captain?.vehicle?.plate}</h4>
            <p className='text-sm px-2 text-gray-600'>{ride?.captain?.vehicle?.color} Hyundai Verna</p>
        </div>
      </div>
      <div className='flex gap-2 justify-between flex-col  items-center '>
            <div className='w-full mt-5 '>
                <div className='flex items-center gap-5 p-3 border-b-2 '>
                  <i className=' text-lg ri-map-pin-2-fill'></i>
                  <div>
                    <h3 className='text-lg font-medium'>{ride?.pickupLocation}</h3>
                    <p className='text-sm -mt-1 text-gray-600 '>{ride?.dropLocation}</p>
                  </div>
                </div>
                <div className='flex items-center gap-5 p-3  '>
                  <i className=' ri-currency-line'></i>
                  <div>
                    <h3 className='text-lg font-medium'>₹{ride?.fare}</h3>
                    <p className='text-sm -mt-1 text-gray-600 '>Cash</p>
                  </div>
                </div>
            </div>
      </div>
            <button className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg' >Make A Payment</button>
        </div>
    </div>
  )
}

export default Riding