import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='speciality'>
        {/* Heading */}
        <motion.h1
            className='text-3xl font-medium'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            Find by Speciality
        </motion.h1>

        {/* Subtitle */}
        <motion.p
            className='sm:w-1/3 text-center text-sm'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            Simply browse through our extensive list of trusted doctors, <br className='hidden sm:block' /> schedule your appointment hassle-free.
        </motion.p>

        {/* Speciality cards */}
        <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
            {specialityData.map((item, index) => (
                <motion.div
                    key={index}
                    className='flex flex-col items-center flex-shrink-0 cursor-pointer'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                >
                    <Link
                        to={`/doctors/${item.speciality}`}
                        onClick={() => window.scrollTo(0, 0)}
                        className='flex flex-col items-center text-xs'
                    >
                        <img className='w-16 sm:w-24 mb-2' src={item.image} alt={item.speciality} />
                        <p>{item.speciality}</p>
                    </Link>
                </motion.div>
            ))}
        </div>
    </div>
  )
}

export default SpecialityMenu
