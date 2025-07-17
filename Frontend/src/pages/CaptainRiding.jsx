import React, { useRef,useState } from 'react'
import { Link } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const CaptainRiding = () => {
    const [finishridepanel, setfinishridepanel] = useState(false)
    const finishridepanelRef = useRef(null)

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
        <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
        <Link to='/home' className='  h-10 w-10 bg-white flex items-center justify-center rounded-full'>
            <i className=' text-lg font-medium ri-logout-box-r-line'></i>
        </Link>
      </div>
        <div className='h-4/5'>
            <img className="h-full w-full object-cover" src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
        </div>
        <div className='h-1/5 p-6 bg-yellow-400 flex relative items-center justify-between '  onClick={()=>{
            setfinishridepanel(true)
        }}>
       
          <h5 className='p-1 text-center w-[90%] absolute top-0' onClick={() => {
                
            }}><i className="text-3xl text-black ri-arrow-up-wide-line"></i></h5>
          <h4 className='text-xl font-semibold'>4 Km away </h4>
          <button className='  bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
      </div>
      <div ref={finishridepanelRef} className='fixed w-full z-10 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white '>
          <FinishRide setfinishridepanel={setfinishridepanel}/>
      </div>
      
    </div>
  )
}

export default CaptainRiding