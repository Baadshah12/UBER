import React, { useRef, useState } from 'react'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const vehiclePanelRef = useRef(null)
  const confirmRidePanelRef= useRef(null)
  const vehicleFoundRef= useRef(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef(null)
  const waitingForDriverRef = useRef(null)
  const panelCloserRef = useRef(null)
  const [vehiclePanel, setvehiclePanel]= useState(false) 
  const [confirmRidePanel, setconfirmRidePanel] = useState(false)
  const [vehicleFound, setvehicleFound] = useState(false)
  const [waitingForDriver, setwaitingForDriver] = useState(false)


  const submitHandler = (e) => {
    e.preventDefault()
  }
  useGSAP(function (name) {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '70%',
        padding: 24
      })
      gsap.to(panelCloserRef.current, {
        opacity:1
      })
    }else{
      gsap.to(panelRef.current, {
        height: '0%',
        padding: 0
        
      })
      gsap.to(panelCloserRef.current, {
        opacity: 0
      })
    }
  }, [panelOpen])

  useGSAP(function () {
    if(vehiclePanel){
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0%)'
      })
    } else{
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehiclePanel])

  useGSAP(function () {
    if(confirmRidePanel){
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(0%)'
      })
    } else{
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmRidePanel])

  useGSAP(function () {
    if(vehicleFound){
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0%)'
      })
    } else{
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehicleFound])

  useGSAP(function () {
    if(waitingForDriver){
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0%)'
      })
    } else{
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [waitingForDriver])

  return (
    <div className='h-screen relative overflow-hidden'>
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" className="w-16 absolute left-5 top-5" />
        <div  className='h-screen w-screen '>
          <img src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Google Maps Icon" className="h-full w-full object-cover" />
        </div>
        <div className=' flex flex-col justify-end h-screen absolute top-0 w-full '>
          <div className='h-[30%] bg-white p-6 relative'>
            <h5  ref={panelCloserRef} onClick={() => setPanelOpen(!panelOpen)} className='absolute opacity-0 top-6 right-6 text-2xl '>
              <i className="ri-arrow-down-s-line"></i>
            </h5>
            <h4 className='text-2xl font-semibold'>Find a trip</h4>
            <form onSubmit={(e) =>  {
              submitHandler(e)
            }}>
              <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-900 rounded-full"></div>
              <input onClick={() => setPanelOpen(true)} value={pickup} onChange={(e) => setPickup(e.target.value)} className='bg-[#eeeeee] mt-5 rounded-lg px-12 py-2 border w-full text-lg ' type="text" placeholder='Add a pick-up location' />
              <input onClick={() => setPanelOpen(true)} value={destination} onChange={(e) => setDestination(e.target.value)} className='bg-[#eeeeee] mt-3 rounded-lg px-12 py-2 border w-full text-lg ' type="text" placeholder='Enter your destination' />
            </form>
          </div>
          <div ref={panelRef} className='h-0  bg-white '>
              <LocationSearchPanel  setPanelOpen={setPanelOpen}  setvehiclePanel={setvehiclePanel}/>
          </div>
        </div>
        <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white '>
          <VehiclePanel setconfirmRidePanel={setconfirmRidePanel} setvehiclePanel={setvehiclePanel} />
        </div>
        <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white '>
          <ConfirmRide setconfirmRidePanel={setconfirmRidePanel} setvehicleFound={setvehicleFound} />
        </div>
        <div ref={vehicleFoundRef}  className='fixed w-full z-10 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white '>
            <LookingForDriver setvehicleFound={setvehicleFound} />
        </div>
        <div ref={waitingForDriverRef}  className='fixed w-full z-10 bottom-0 px-3 py-6 pt-12 bg-white '>
            <WaitingForDriver waitingForDriver={waitingForDriver} />
        </div>
    </div>
  )
}

export default Home