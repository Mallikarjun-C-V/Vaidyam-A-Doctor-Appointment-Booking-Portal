import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const navigate = useNavigate()

  const slotDateFormat = (slot) => {

    const dateArray = slot.split('_')
    return dateArray[0] + "," + months[Number(dateArray[1])] + "," + dateArray[2]

  }

  const getUserAppointments = async () => {

    try {

      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

  }

  const cancelAppointment = async (appointmentId) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
    
  }

  const initPay = (order) => {

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);

        try {

          const {data} = await axios.post(backendUrl+'/api/user/verifyRazorpay',response,{headers:{token}})
          if (data.success) {
            getUserAppointments()
            navigate('/my-appointments')
          }
          
        } catch (error) {
          toast.error(error.message)
        }
      }
    }
    
    const rzp = new window.Razorpay(options)
    rzp.open()
    
  }
  
  const appointmentRazorpay = async (appointmentId) => {
    
    try {
      
      const {data} = await axios.post(backendUrl+'/api/user/payment-razorpay',{appointmentId},{headers:{token}})
      
      if (data.success) {
        initPay(data.order)
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
  }, [token])

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
  className="flex flex-col md:flex-row items-center md:items-start p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  key={index}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: index * 0.2 }}
  whileHover={{ scale: 1.02 }}
>
  {/* Doctor Image */}
  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
    <motion.img
      className="w-32 h-32 md:w-36 md:h-36 object-cover rounded-xl bg-indigo-50"
      src={item.docData.image}
      alt={`Dr. ${item.name}`}
      whileHover={{ scale: 1.1, rotate: 2 }}
      transition={{ type: 'spring', stiffness: 180, damping: 12 }}
    />
  </div>

  {/* Doctor Info */}
  <div className="flex-grow text-sm text-gray-600 space-y-2 text-center md:text-left">
    <p className="text-xl font-bold text-gray-900">{item.docData.name}</p>
    <p className="text-indigo-600 font-medium -mt-1">{item.docData.speciality}</p>

    <div className="!mt-4">
      <p className="text-gray-700 font-semibold">Address:</p>
      <p className="text-xs text-gray-500">{item.docData.address.line1}</p>
      <p className="text-xs text-gray-500">{item.docData.address.line2}</p>
    </div>

    <div className="!mt-4 inline-block bg-gray-100 text-gray-800 font-semibold px-3 py-1 rounded-full text-xs">
      <span className="mr-1.5">🗓️</span>
      Date & Time: {slotDateFormat(item.slotDate)} | {item.slotTime}
    </div>
  </div>

  {/* Buttons */}
  <div className="flex flex-col justify-center md:justify-center items-center md:items-start gap-3 mt-4 md:mt-0 md:ml-auto w-full md:w-auto">
    {!item.cancelled && item.payment && (
      <motion.button
        className="text-sm font-semibold text-center w-full md:min-w-48 px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}        
      >
        Paid
      </motion.button>
    )}

    {!item.cancelled && !item.payment && (
      <motion.button
        onClick={() => appointmentRazorpay(item._id)}
        className="text-sm font-semibold text-center w-full md:min-w-48 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        Pay Online
      </motion.button>
    )}

    {!item.cancelled && (
      <motion.button
        onClick={() => cancelAppointment(item._id)}
        className="text-sm font-semibold text-center w-full md:min-w-48 px-4 py-2 bg-transparent text-red-600 border border-red-300 rounded-lg hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        Cancel Appointment
      </motion.button>
    )}

    {item.cancelled && (
      <motion.div
        className="flex items-center justify-center text-sm font-semibold text-center w-full md:min-w-48 px-4 py-2 bg-gray-100 text-red-600 border border-red-200 rounded-lg cursor-not-allowed select-none h-[44px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        Appointment Cancelled
      </motion.div>
    )}
  </div>
</motion.div>


        ))}
      </div>
    </motion.div>
  )
}

export default MyAppointments
