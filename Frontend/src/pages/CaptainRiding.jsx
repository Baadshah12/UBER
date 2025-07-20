import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'

const CaptainRiding = () => {
    const [finishridepanel, setfinishridepanel] = useState(false)
    const finishridepanelRef = useRef(null)
    const location = useLocation();
    const ride = location.state?.ride;

    useGSAP(function () {
    if (finishridepanel) {
      gsap.to(finishridepanelRef.current, {
        transform:'translateY(0)'
      })
    } else {
      gsap.to(finishridepanelRef.current, {
        transform:'translateY(100%)'
      })
    }
  }, [finishridepanel])

  return (
   <div className='h-screen relative'>
      <div className='fixed p-6 top-0 flex items-center justify-between w-full'>
        <LiveTracking />
        <Link to='/home' className='  h-10 w-10 bg-white flex items-center justify-center rounded-full'>
            <i className=' text-lg font-medium ri-logout-box-r-line'></i>
        </Link>
      </div>
        <div className='h-4/5'>
            <LiveTracking />
        </div>
        <div className='h-1/5 p-6 bg-yellow-400 flex relative items-center justify-between '  onClick={()=>{
            setfinishridepanel(true)
        }}>
          <h5 className='p-1 text-center w-[90%] absolute top-0' onClick={() => {
                
            }}><i className="text-3xl text-black ri-arrow-up-wide-line"></i></h5>
          <div>
            <h4 className='text-sm font-semibold'>Pickup: {ride?.pickupLocation}</h4>
            <h4 className='text-sm font-semibold'>Drop: {ride?.dropLocation}</h4>
            <h4 className='text-sm font-semibold'>Fare: ₹{ride?.fare}</h4>
            <h4 className='text-sm font-semibold'>OTP: {ride?.otp}</h4>
          </div>
          <button className='  bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
      </div>
      <div ref={finishridepanelRef} className='fixed w-full z-10 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white '>
          <FinishRide 
          ride={ride}
          setfinishridepanel={setfinishridepanel}/>
      </div>
      
    </div>
  )
}

export default CaptainRiding