import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Banner = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col md:flex-row bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl 
                        px-8 sm:px-12 md:px-16 lg:px-14 my-24 md:mx-10 shadow-xl relative ">
            
            {/* left */}
            <motion.div
                className='flex-1 py-12 sm:py-16 lg:py-24 lg:pl-5 
                           flex flex-col items-center md:items-start justify-center text-center md:text-left'
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true }}
            >
                <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                    <p>Book Appointment</p>
                    <p className='mt-4'>With 100+ Trusted Doctors</p>
                </div>
                <button
                    onClick={() => { navigate('/login'); scrollTo(0, 0) }}
                    className='bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'
                >
                    Create account
                </button>
            </motion.div>

            {/* right */}
            <motion.div
                className='hidden md:flex md:w-1/2 lg:w-[370px] relative items-end justify-end'
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true }}
            >
                <img 
                    className='w-full max-w-md object-contain md:absolute md:bottom-0 md:right-0'
                    src={assets.appointment_img}
                    alt="appointment banner"
                />
            </motion.div>
        </div>
    )
}

export default Banner
