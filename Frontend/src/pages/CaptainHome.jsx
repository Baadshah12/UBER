import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { gsap } from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useGSAP } from '@gsap/react'
import { SocketContext } from '../context/SocketContext.jsx'
import { CaptainDataContext } from '../context/CaptainContext.jsx'
import { useContext } from 'react'
import axios from 'axios'
import LiveTracking from '../components/LiveTracking'

const CaptainHome = () => {

  const [ridePopupPanel, setridePopupPanel] = useState(false)
  const [ride, setride] = useState(null)
  const [confirmridePopupPanel, setconfirmridePopupPanel] = useState(false)
  const ridePopupPanelRef = useRef(null)
  const confirmridePopupPanelRef = useRef(null)
  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        })
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {

                    console.log('UserId:', captain._id, 'Location:', {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })

                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
        }
      }

      // You may want to call updateLocation here or set up an interval
      const locationInterval = setInterval(updateLocation, 10000); // Update every 10 seconds
      updateLocation();

  }, []);
      socket.on('new-ride', (data) => {
        console.log('New ride request received:', data);
        setride(data);
        setridePopupPanel(true);

      })  

    async function confirmRide() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
          rideId: ride._id
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        console.log('Ride confirmed:', response.data);
        setconfirmridePopupPanel(true)
        setridePopupPanel(false)
      } catch (error) {
        console.error('Error confirming ride:', error);
      }
    }

  useGSAP(function ()  {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        transform:'translateY(0)'
      })
    } else {
      gsap.to(ridePopupPanelRef.current, {
        transform:'translateY(100%)'
      })
    }
  }, [ridePopupPanel])

  useGSAP(function () {
    if (confirmridePopupPanel) {
      gsap.to(confirmridePopupPanelRef.current, {
        transform:'translateY(0)'
      })
    } else {
      gsap.to(confirmridePopupPanelRef.current, {
        transform:'translateY(100%)'
      })
    }
  }, [confirmridePopupPanel])

  return (
    <div className='h-screen'>
      <div className='fixed p-6 top-0 flex items-center justify-between w-full'>
        <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
        <Link to='/captain-login' className='  h-10 w-10 bg-white flex items-center justify-center rounded-full'>
            <i className=' text-lg font-medium ri-logout-box-r-line'></i>
        </Link>
      </div>
        <div className='h-3/5'>
            <LiveTracking height='60vh' />
        </div>
        <div className='h-2/5 p-6 '>
          <CaptainDetails />
      </div>
      <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white '>
          <RidePopUp
          ride={ride}
          confirmRide={confirmRide}
          setridePopupPanel={setridePopupPanel} setconfirmridePopupPanel={setconfirmridePopupPanel} />
      </div>
      <div ref={confirmridePopupPanelRef } className='fixed h-screen w-full z-10 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white '>
          <ConfirmRidePopUp
          ride={ride}

          setconfirmridePopupPanel={setconfirmridePopupPanel} setridePopupPanel={setridePopupPanel} />
      </div>
    </div>
  )
}

export default CaptainHome;