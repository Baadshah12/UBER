import React from 'react'

const LocationSearchPanel = (props) => {
  const locations=[
    "24A,Near Kapoor's cafe,Sheriyans Coding School,Bhopal",
    "22B,Near Malhotra's cafe,Sheriyans Coding School,Bhopal",
    "26C,Near Singhania's cafe,Sheriyans Coding School,Bhopal"
  ]
  return (
    <div>
      {
        locations.map(function(elem,idx){
          return <div key={idx} onClick={()=>{props.setvehiclePanel(true); props.setPanelOpen(false)}}  className='flex  border-2 p-3 border-gray-100 active:border-black  gap-4 items-center my-2 rounded-xl justify-start '>
            <h2 className='bg-[#eeeeee] rounded-full flex items-center justify-center h-8 w-12'><i className="ri-map-pin-fill "></i></h2>
            <h4 className='font-medium'>{elem}</h4>
        </div>
        })
      }
        
    </div>
  )
}

export default LocationSearchPanel