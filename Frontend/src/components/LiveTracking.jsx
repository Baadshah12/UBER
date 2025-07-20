import React, { useState, useEffect } from 'react'
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'

const defaultCenter = {
  lat: 0,
  lng: 0,
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API

const LiveTracking = ({ userLocation = null, height = '100vh' }) => {
  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)

  const containerStyle = {
    width: '100%',
    height: height,
  }

  useEffect(() => {
    // If userLocation prop is provided, use it
    if (userLocation) {
      setPosition(userLocation)
      return
    }

    // Otherwise, use the original geolocation logic
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }
    
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        (err) => {
          setError('Unable to retrieve your location')
        },
        { enableHighAccuracy: true }
      )
    }

    updateLocation(); // Initial fetch
    const intervalId = setInterval(updateLocation, 10000); // Update every 10 seconds

    return () => clearInterval(intervalId)
  }, [userLocation])

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position || defaultCenter}
          zoom={position ? 15 : 2}
        >
          {position && <Marker position={position} />}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default LiveTracking