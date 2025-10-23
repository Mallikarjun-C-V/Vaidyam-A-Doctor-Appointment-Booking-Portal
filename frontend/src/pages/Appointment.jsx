import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }

  const getAvailableSlots = () => {
    if (!docInfo) return
    const slotsArray = []
    const today = new Date()
    const skipToday = today.getHours() > 20 || (today.getHours() === 20 && today.getMinutes() > 30)

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      if (skipToday) currentDate.setDate(today.getDate() + i + 1)
      else currentDate.setDate(today.getDate() + i)

      const endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0) // end at 9 PM

      if (!skipToday && today.getDate() === currentDate.getDate()) {
        // today, start from next available slot
        const nextHour = today.getHours() >= 10 ? today.getHours() + 1 : 10
        const nextMinutes = today.getMinutes() > 30 ? 30 : 0
        currentDate.setHours(nextHour, nextMinutes, 0, 0)
      } else {
        currentDate.setHours(10, 0, 0, 0)
      }

      const timeSlots = []
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const date = currentDate.getDate()
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const slotDate = date + "_" + month + "_" + year

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(formattedTime)
            ? false
            : true

        if (isSlotAvailable) {
          timeSlots.push({ datetime: new Date(currentDate), time: formattedTime })
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      slotsArray.push(timeSlots)
    }

    setDocSlots(slotsArray)
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    if (!slotTime) {
      toast.error('Select a time slot')
      return
    }

    try {
      const dateObj = docSlots[slotIndex][0].datetime
      const day = dateObj.getDate()
      const month = dateObj.getMonth() + 1
      const year = dateObj.getFullYear()
      const slotDate = day + "_" + month + "_" + year

      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => { fetchDocInfo() }, [doctors, docId])
  useEffect(() => { getAvailableSlots() }, [docInfo])

  return docInfo && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="overflow-hidden">
      {/* Doctor Details */}
      <motion.div className='flex flex-col sm:flex-row gap-4' initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true }}>
        <motion.div whileHover={{ scale: 1.03, rotate: 0.5 }} transition={{ type: "spring", stiffness: 180, damping: 12 }}>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </motion.div>

        <motion.div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0' initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} viewport={{ once: true }}>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <motion.img className='w-5' src={assets.verified_icon} alt="" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </motion.div>
      </motion.div>

      {/* Booking Slots */}
      <motion.div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700' initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} viewport={{ once: true }}>
        <p>Booking Slots</p>

        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots.map((item, index) => (
            <motion.div key={index} onClick={() => setSlotIndex(index)} whileHover={{ scale: 1.1, rotate: -1 }} transition={{ type: "spring", stiffness: 180, damping: 12 }} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}>
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </motion.div>
          ))}
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item, index) => (
            <motion.p key={index} onClick={() => setSlotTime(item.time)} whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}>
              {item.time.toLowerCase()}
            </motion.p>
          ))}
        </div>

        <motion.button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}>
          Book an appointment
        </motion.button>
      </motion.div>

      {/* Related Doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </motion.div>
  )
}

export default Appointment
