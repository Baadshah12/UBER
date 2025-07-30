import React from 'react'

const WaitingForDriver = (props) => {
  const { captain, ride } = props;
  
  return (
    <div>
       <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.waitingForDriver(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
      <div className='flex items-center justify-between '>
        <img className='h-16 '   src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_552,w_552/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d80a9c47/original/Final_UberX.png" alt="" />
        <div className='text-right' >
            <h2 className='text-lg font-medium p-2'>{captain?.fullname?.firstname} {captain?.fullname?.lastname}</h2>
            <h4 className='text-xl p-2 font-semibold -mt-2 -mb-1'>{captain?.vehicle?.plate}</h4>
            <p className='text-sm px-2 text-black'>{captain?.vehicle?.color} Hyundai Verna</p>
            <h1 className='text-lg font-semibold'>OTP: {props.ride?.otp}</h1>
        </div>
      </div>
      <div className='flex gap-2 justify-between flex-col  items-center '>
            <div className='w-full mt-5 '>
                <div className='flex items-center gap-5 p-3 border-b-2 '>
                  <i className=' ri-map-pin-user-fill'></i>
                  <div>
                    <h3 className='text-lg font-medium'>Pickup</h3>
                    <p className='text-sm -mt-1 text-gray-600 '>{props.ride?.pickupAddress || props.ride?.pickupLocation}</p>
                  </div>
                </div>
                <div className='flex items-center gap-5 p-3 border-b-2 '>
                  <i className=' text-lg ri-map-pin-2-fill'></i>
                  <div>
                    <h3 className='text-lg font-medium'>Destination</h3>
                    <p className='text-sm -mt-1 text-gray-600 '>{props.ride?.dropAddress || props.ride?.dropLocation}</p>
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
    </div>
  )
}

export default WaitingForDriver