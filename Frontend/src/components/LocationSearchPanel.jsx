import React from 'react'

const LocationSearchPanel = (props) => {
  const { suggestions = [], onSuggestionClick } = props
  // Debug: log suggestions received
  return (
    <div>
      {
        Array.isArray(suggestions) && suggestions.length > 0 ? (
          suggestions.map((elem, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSuggestionClick(elem)
                // panel closing logic removed
              }}
              className='flex border-2 p-3 border-gray-100 active:border-black gap-4 items-center my-2 rounded-xl justify-start '
            >
              <h2 className='bg-[#eeeeee] rounded-full flex items-center justify-center  h-8 w-12'>
                <i className="ri-map-pin-fill "></i>
              </h2>
              <h4 className='font-medium'>{typeof elem === 'string' ? elem : elem.description || JSON.stringify(elem)}</h4>
            </div>
          ))
        ) : (
          <div className='text-gray-400 p-4 mt-3'>No suggestions found.</div>
        )
      }
    </div>
  )
}

export default LocationSearchPanel