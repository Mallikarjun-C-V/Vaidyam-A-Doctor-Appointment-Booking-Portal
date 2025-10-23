import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import axios from 'axios'

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slot) => {

    const dateArray = slot.split('_')
    return dateArray[0]+ ","+months[Number(dateArray[1])] + "," + dateArray[2]

  }

  const getUserAppointments = async () => {

    try {

      const {data} = await axios.get(backendUrl+'/api/user/appointments', {headers:{token}})

      if (data.success) {
        setAppointments(data.appointments.reverse())        
        console.log(data.appointments);
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  },[token])

  return (
    <motion.div 
      className='bg-gray-50 min-h-screen p-4 sm:p-8 mt-10 mb-20 rounded-[20px]'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className='pb-4 mb-8 text-3xl font-bold text-gray-800 border-b-2 border-gray-200'>
        My Appointments
      </h1>

      <div className='space-y-6'>
        {appointments.map((item, index) => (
          <motion.div
            className='flex flex-col md:flex-row items-start p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className='flex-shrink-0 mb-4 md:mb-0 md:mr-6'>
              <motion.img
                className='w-28 h-28 object-cover rounded-lg bg-indigo-50'
                src={item.docData.image}
                alt={`Dr. ${item.name}`}
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 180, damping: 12 }}
              />
            </div>

            <div className='flex-grow text-sm text-gray-600 space-y-2'>
              <p className='text-xl font-bold text-gray-900'>{item.docData.name}</p>
              <p className='text-indigo-600 font-medium -mt-1'>{item.docData.speciality}</p>
              
              <div className='!mt-4'> 
                <p className='text-gray-700 font-semibold'>Address:</p>
                <p className='text-xs text-gray-500'>{item.docData.address.line1}</p>
                <p className='text-xs text-gray-500'>{item.docData.address.line2}</p>
              </div>

              <div className='!mt-4 inline-block bg-gray-100 text-gray-800 font-semibold px-3 py-1 rounded-full text-xs'>
                <span className='mr-1.5'>🗓️</span>
                Date & Time: {slotDateFormat(item.slotDate)} | {item.slotTime}
              </div>
            </div>

            <div className='flex flex-row md:flex-col justify-start md:justify-center gap-3 mt-4 md:mt-0 md:ml-auto w-full md:w-auto'>
              <motion.button
                className='text-sm font-semibold text-center w-full md:min-w-48 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Pay Online
              </motion.button>
              <motion.button
                className='text-sm font-semibold text-center w-full md:min-w-48 px-4 py-2 bg-transparent text-red-600 border border-red-300 rounded-lg hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel Appointment
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default MyAppointments
