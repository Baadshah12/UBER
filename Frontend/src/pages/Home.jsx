import React, { useRef, useState } from 'react'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import axios from 'axios'
import { SocketContext } from '../context/SocketContext.jsx'
import { useContext, useEffect } from 'react'
import { UserContextData } from '../context/UserContext.jsx'

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [vehicleType, setVehicleType] = useState(null); 
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
  const [suggestions, setSuggestions] = useState([])
  const [activeField, setActiveField] = useState('') // 'pickup' or 'destination'
  const [fare, setFare] = useState({})
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContextData);

  useEffect(() => {
    console.log('User:', user);
    socket.emit("join",{userType:"user",userId:user._id})
  },[user])
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
        transform: 'translateY(0)'
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
        transform: 'translateY(0)'
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

  async function findTrip(){
    setvehiclePanel(true)
    setPanelOpen(false)

    const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/getFare`,
        {
          params: { pickupLocation: pickup, dropLocation: destination
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

    console.log('Fare response:', response.data)
    if (response.data && response.data.fare) {
      setFare(response.data.fare)
    } else {
      console.error('Fare data not found in response')
      setFare({})
    }
  }

  async function createRide(){
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/create`,
      {
        pickupLocation: pickup,
        dropLocation: destination,
        vehicleType: vehicleType
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    .then((response) => {
      console.log('Ride created:', response.data)
    })
    .catch((error) => {
      console.error('Error creating ride:', error)
    })
  } 

  // Fetch suggestions from backend
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([])
      return
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: query },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      // Debug: log the response
      console.log('Suggestions:', response.data)
      setSuggestions(response.data)
    } catch (err) {
      setSuggestions([])
      console.error('Error fetching suggestions:', err)
    }
  }

  // Handle input changes
  const handlePickupChange = (e) => {
    setPickup(e.target.value)
    setActiveField('pickup')
    fetchSuggestions(e.target.value)
    setPanelOpen(true)
  }
  const handleDestinationChange = (e) => {
    setDestination(e.target.value)
    setActiveField('destination')
    fetchSuggestions(e.target.value)
    setPanelOpen(true)
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (activeField === 'pickup') {
      setPickup(suggestion)
      // Keep panel open for destination input
      setActiveField('destination')
      setSuggestions([])
    } else if (activeField === 'destination') {
      setDestination(suggestion)
      setSuggestions([])
    }
  }

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
            <form  onSubmit={(e) =>  {
              submitHandler(e)
            }}>
              <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-900 rounded-full"></div>
              <input
                onClick={() => { setPanelOpen(true); setActiveField('pickup'); }}
                value={pickup}
                onChange={handlePickupChange}
                className='bg-[#eeeeee] mt-5 rounded-lg px-12 py-2 border w-full text-lg '
                type="text"
                placeholder='Add a pick-up location'
              />
              <input
                onClick={() => { setPanelOpen(true); setActiveField('destination'); }}
                value={destination}
                onChange={handleDestinationChange}
                className='bg-[#eeeeee] mt-3 rounded-lg px-12 py-2 border w-full text-lg '
                type="text"
                placeholder='Enter your destination'
              />
            </form>
     
            <button onClick={findTrip} className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
              Find Trip
            </button>
          </div>
          <div ref={panelRef} className='h-0 bg-white '>
              <LocationSearchPanel
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
                setPanelOpen={setPanelOpen}
                setvehiclePanel={setvehiclePanel}
              />
          </div>
        </div>
        <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white '>
          <VehiclePanel selectVehicle={setVehicleType} fare={fare} setconfirmRidePanel={setconfirmRidePanel} setvehiclePanel={setvehiclePanel} />
        </div>
        <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 '>
          <ConfirmRide 
          createRide={createRide} 
          pickup={pickup} 
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setconfirmRidePanel={setconfirmRidePanel} setvehicleFound={setvehicleFound} />
        </div>
        <div ref={vehicleFoundRef}  className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 '>
            <LookingForDriver
             createRide={createRide} 
            pickup={pickup} 
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setvehicleFound={setvehicleFound} />
        </div>
        <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 px-3 py-6 pt-12 bg-white '>
            <WaitingForDriver waitingForDriver={setwaitingForDriver} />
        </div>
    </div>
  )
}

export default Home