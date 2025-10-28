import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'

const Header = () => {
  const [width, setWidth] = useState(window.innerWidth)

  // update width on resize
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10'>

      {/* left */}
      <motion.div
        className='md:w-1/2 flex flex-col items-center md:items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        {width >= 768 ? (
          <motion.p
            className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight text-left'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            Book Appointment <br /> With Trusted Doctors
          </motion.p>
        ) : (
          <motion.p
            className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight text-center'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            Book Appointment <br /> With Trusted Doctors
          </motion.p>
        )}

        <motion.div
          className={`flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light 
            ${width >= 1024 ? 'text-left justify-start' : 'text-center justify-center'}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <img className='w-28' src={assets.group_profiles} alt='' />
          <p>
            Simply browse through our extensive list of trusted doctors,{' '}
            <br className='hidden sm:block' />
            schedule your appointment hassle-free.
          </p>
        </motion.div>

        <motion.a
          className={`flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm 
            hover:scale-105 transition-all duration-300 
            ${width >= 1024 ? 'self-start' : 'self-center'}`}
          href='#speciality'
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          Book appointment <img className='w-3 py-1' src={assets.arrow_icon} alt='' />
        </motion.a>
      </motion.div>

      <motion.div
        className='md:w-1/2 relative'
        initial={{ opacity: 0, x: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <img
          className='w-full md:absolute bottom-0 h-auto rounded-lg'
          src={assets.header_img}
          alt='Header'
        />
      </motion.div>
    </div>
  )
}

export default Header
