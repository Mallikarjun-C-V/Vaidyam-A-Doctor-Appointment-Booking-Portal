import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const MyAppointments = () => {
  const { doctors } = useContext(AppContext)

  return (
    <div className='bg-gray-50 min-h-screen p-4 sm:p-8 mt-10 mb-20 rounded-[20px]'>
      <h1 className='pb-4 mb-8 text-3xl font-bold text-gray-800 border-b-2 border-gray-200'>
        My Appointments
      </h1>

      <div className='space-y-6'>
        {doctors.slice(0, 3).map((item, index) => (
          <div
            className='flex flex-col md:flex-row items-start p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
            key={index}
          >
            <div className='flex-shrink-0 mb-4 md:mb-0 md:mr-6'>
              <img
                className='w-28 h-28 object-cover rounded-lg bg-indigo-50'
                src={item.image}
                alt={`Dr. ${item.name}`} 
              />
            </div>

            <div className='flex-grow text-sm text-gray-600 space-y-2'>
              <p className='text-xl font-bold text-gray-900'>{item.name}</p>
              <p className='text-indigo-600 font-medium -mt-1'>{item.speciality}</p>
              
              <div className='!mt-4'> 
                <p className='text-gray-700 font-semibold'>Address:</p>
                <p className='text-xs text-gray-500'>{item.address.line1}</p>
                <p className='text-xs text-gray-500'>{item.address.line2}</p>
              </div>

              <div className='!mt-4 inline-block bg-gray-100 text-gray-800 font-semibold px-3 py-1 rounded-full text-xs'>
                <span className='mr-1.5'>🗓️</span> {/* Simple emoji icon */}
                Date & Time: 25, July, 2024 | 8:30 AM
              </div>
            </div>

            <div className='flex flex-row md:flex-col justify-start md:justify-center gap-3 mt-4 md:mt-0 md:ml-auto w-full md:w-auto'>
              <button className='text-sm font-semibold text-center w-full md:min-w-48 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300'>
                Pay Online
              </button>
              <button className='text-sm font-semibold text-center w-full md:min-w-48 px-4 py-2 bg-transparent text-red-600 border border-red-300 rounded-lg hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300'>
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments