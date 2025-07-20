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
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

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
  const [captainData, setCaptainData] = useState(null) // Add state for captain data
  const [rideData, setRideData] = useState(null) // Add state for complete ride data
  const [userLocation, setUserLocation] = useState(null) // Add state for user location
  const navigate = useNavigate()

  useEffect(() => {
    socket.emit("join",{userType:"user",userId:user._id})
    
    // Add user location tracking
    const updateUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          
          setUserLocation(location) // Set local state for map

          socket.emit('update-location-user', {
            userId: user._id,
            location: location
          })
        }, (error) => {
          console.error('Error getting user location:', error)
        })
      }
    }

    socket.on('ride-started', (ride) => {
      console.log('Ride started:', ride)
      setwaitingForDriver(false)
      navigate('/riding', { state: { ride } })
    })

    // Update location every 10 seconds
    const locationInterval = setInterval(updateUserLocation, 10000);
    updateUserLocation(); // Initial location update

    return () => {
      clearInterval(locationInterval);
    }
  },[user, socket])

  // Handle body scroll when panels are active
  useEffect(() => {
    const isAnyPanelActive = vehiclePanel || confirmRidePanel || vehicleFound || waitingForDriver;
    
    if (isAnyPanelActive) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [vehiclePanel, confirmRidePanel, vehicleFound, waitingForDriver]);

  socket.on('ride-confirmed', (rideData) => {
    console.log('=== RIDE CONFIRMED EVENT ===');
    console.log('Full ride data:', rideData);
    console.log('Captain data:', rideData.captain);
    console.log('User data:', rideData.user);
    console.log('Ride details:', {
      pickup: rideData.pickupLocation,
      drop: rideData.dropLocation,
      fare: rideData.fare,
      otp: rideData.otp
    });
    
    resetOtherPanels('waiting')
    setvehicleFound(false); // Close the "Looking for Driver" panel
    setwaitingForDriver(true); // Show the "Waiting for Driver" panel
    setCaptainData(rideData.captain); // Store captain data
    setRideData(rideData); // Store complete ride data
    console.log('=== END RIDE CONFIRMED EVENT ===');
  })

  const submitHandler = (e) => {
    e.preventDefault()
  }

  // Utility function to ensure only one panel is active at a time
  const resetOtherPanels = (activePanel) => {
    if (activePanel !== 'vehicle') setvehiclePanel(false)
    if (activePanel !== 'confirm') setconfirmRidePanel(false)
    if (activePanel !== 'found') setvehicleFound(false)
    if (activePanel !== 'waiting') setwaitingForDriver(false)
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
        transform: 'translateY(0)',
        duration: 0.3,
        ease: 'power2.out'
      })
      // Hide other panels when vehicle panel is active
      gsap.to(confirmRidePanelRef.current, { transform: 'translateY(100%)', duration: 0.2 })
      gsap.to(vehicleFoundRef.current, { transform: 'translateY(100%)', duration: 0.2 })
      gsap.to(waitingForDriverRef.current, { transform: 'translateY(100%)', duration: 0.2 })
    } else{
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)',
        duration: 0.3,
        ease: 'power2.in'
      })
    }
  }, [vehiclePanel])

  useGSAP(function () {
    if(confirmRidePanel){
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(0)',
        duration: 0.3,
        ease: 'power2.out'
      })
      // Hide other panels when confirm ride panel is active
      gsap.to(vehiclePanelRef.current, { transform: 'translateY(100%)', duration: 0.2 })
      gsap.to(vehicleFoundRef.current, { transform: 'translateY(100%)', duration: 0.2 })
      gsap.to(waitingForDriverRef.current, { transform: 'translateY(100%)', duration: 0.2 })
    } else{
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(100%)',
        duration: 0.3,
        ease: 'power2.in'
      })
    }
  }, [confirmRidePanel])

  useGSAP(function () {
    if(vehicleFound){
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0%)',
        duration: 0.3,
        ease: 'power2.out'
      })
      // Hide other panels when vehicle found panel is active
      gsap.to(vehiclePanelRef.current, { transform: 'translateY(100%)', duration: 0.2 })
      gsap.to(confirmRidePanelRef.current, { transform: 'translateY(100%)', duration: 0.2 })
      gsap.to(waitingForDriverRef.current, { transform: 'translateY(100%)', duration: 0.2 })
    } else{
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)',
        duration: 0.3,
        ease: 'power2.in'
      })
    }
  }, [vehicleFound])

  useGSAP(function () {
    if(waitingForDriver){
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0%)',
        duration: 0.3,
        ease: 'power2.out'
      })
      // Hide other panels when waiting for driver panel is active
      gsap.to(vehiclePanelRef.current, { transform: 'translateY(100%)', duration: 0.2 })
      gsap.to(confirmRidePanelRef.current, { transform: 'translateY(100%)', duration: 0.2 })
      gsap.to(vehicleFoundRef.current, { transform: 'translateY(100%)', duration: 0.2 })
    } else{
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)',
        duration: 0.3,
        ease: 'power2.in'
      })
    }
  }, [waitingForDriver])

  async function findTrip(){
    resetOtherPanels('vehicle')
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
    // Get current user location before creating ride
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        console.log('Creating ride with user location:', userLocation);

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/rides/create`,
          {
            pickupLocation: pickup,
            dropLocation: destination,
            vehicleType: vehicleType,
            userLocation: userLocation // Send GPS coordinates
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
      }, (error) => {
        console.error('Error getting location for ride creation:', error);
        // Fallback to address-based ride creation
        createRideWithAddress();
      });
    } else {
      // Fallback to address-based ride creation
      createRideWithAddress();
    }
  }

  // Fallback function for address-based ride creation
  async function createRideWithAddress() {
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
      console.log('Ride created with address:', response.data)
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
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" className="w-16 absolute left-5 top-5 z-10" />
        <div  className='h-screen w-screen '>
          <LiveTracking userLocation={userLocation} />
        </div>
        <div className='flex flex-col justify-end h-screen absolute top-0 w-full'>
          <div className='h-[30%] bg-white pt-2 pb-6 px-6 relative z-10'>
            <h5  ref={panelCloserRef} onClick={() => setPanelOpen(!panelOpen)} className='absolute opacity-0 top-6 right-6 text-2xl z-20'>
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
          <div ref={panelRef} className='h-0 bg-white z-15'>
              <LocationSearchPanel
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
                setPanelOpen={setPanelOpen}
                setvehiclePanel={setvehiclePanel}
              />
          </div>
        </div>
        <div ref={vehiclePanelRef} className='fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white panel-container'>
          <VehiclePanel selectVehicle={setVehicleType} fare={fare} setconfirmRidePanel={setconfirmRidePanel} setvehiclePanel={setvehiclePanel} />
        </div>
        <div ref={confirmRidePanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 panel-container'>
          <ConfirmRide 
          createRide={createRide} 
          pickup={pickup} 
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          
          setconfirmRidePanel={setconfirmRidePanel} setvehicleFound={setvehicleFound} />
        </div>
        <div ref={vehicleFoundRef}  className='fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 panel-container'>
            <LookingForDriver
             createRide={createRide} 
            pickup={pickup} 
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setvehicleFound={setvehicleFound} />
        </div>
        <div ref={waitingForDriverRef} className='fixed w-full z-50 bottom-0 translate-y-full px-3 py-6 pt-12 bg-white panel-container'>
            <WaitingForDriver 
              waitingForDriver={setwaitingForDriver}
              captain={captainData}
              ride={{ 
                pickupLocation: pickup, 
                dropLocation: destination, 
                fare: fare[vehicleType],
                otp: rideData?.otp // Pass OTP from the ride data
              }}
            />
        </div>
    </div>
  )
}

export default Home