import React from 'react'

const VehiclePanel = (props) => {
  return (
    <div>
        <h5  onClick={()=>{
            props.setvehiclePanel(false)
          }}  className='p-1 text-center w-[93%] absolute top-0 '><i className=" text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
          <h3 className='text-2xl font-semibold mb-4'>Choose a vehicle</h3>
          <div onClick={()=>{
            props.setconfirmRidePanel(true)
          }} className='flex w-full border-2 active:border-black mb-2 rounded-xl p-3 items-center justify-between '>
            <img  className='h-16 ' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_552,w_552/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d80a9c47/original/Final_UberX.png" alt="" />
            <div className='ml-2 w-1/2 '>
              <h4 className='font-medium text-base'>UberGo <span><i className="ri-user-3-fill"></i>4</span></h4>
              <h5 className='font-medium text-sm'>2 mins away</h5>
              <p className='font-normal text-xs text-gray-600'>Affortable,compact rides</p>
            </div>
            <h2 className='text-lg font-semibold'>₹193.20</h2>
          </div>
          <div onClick={()=>{
            props.setconfirmRidePanel(true)
          }} className='flex w-full border-2 active:border-black mb-2 rounded-xl p-3 items-center justify-between '>
            <img  className='h-12 ' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_638/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="" />
            <div className=' mr-10 w-1/2 '>
              <h4 className='font-medium text-base'>Moto <span><i className="ri-user-3-fill"></i>1</span></h4>
              <h5 className='font-medium text-sm'>3 mins away</h5>
              <p className='font-normal text-xs text-gray-600'>Affortable motorcycle rides</p>
            </div>
            <h2 className='text-lg font-semibold'>₹65</h2>
          </div>
          <div onClick={()=>{
            props.setconfirmRidePanel(true)
          }} className='flex w-full border-2 active:border-black mb-2 rounded-xl p-3 items-center justify-between '>
            <img  className='h-12 ' src="https://clipart-library.com/2023/Uber_Auto_312x208_pixels_Mobile.png" alt="" />
            <div className=' mr-4 w-1/2 '>
              <h4 className='font-medium text-base'>Auto <span><i className="ri-user-3-fill"></i>3</span></h4>
              <h5 className='font-medium text-sm'>3 mins away</h5>
              <p className='font-normal text-xs text-gray-600'>Affortable auto rides</p>
            </div>
            <h2 className='text-lg font-semibold'>₹118.68</h2>
          </div>
    </div>
  )
}

export default VehiclePanel