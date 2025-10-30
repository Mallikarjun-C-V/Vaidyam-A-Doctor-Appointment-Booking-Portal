import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Contact = () => {

  const navigate = useNavigate()
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Heading */}
      <motion.div 
        className='text-center text-2xl pt-10 text-gray-500'
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </motion.div>

      {/* Main Section */}
      <motion.div 
        className='my-10 flex flex-col justify-center md:flex-row gap-[50px] mb-28 text-sm'
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        {/* Contact Image */}
        <motion.img 
          className='w-full md:max-w-[360px] rounded-[10px] shadow-sm hover:shadow-lg transition-all duration-300'
          src={assets.contact_image} 
          alt="Contact"
          whileHover={{ scale: 1.05, rotate: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 10 }}
        />

        {/* Office Info */}
        <motion.div 
          className="flex flex-col justify-center items-start gap-6 bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className='font-semibold text-lg text-gray-600'>Our OFFICE</p>
          <p className='text-gray-500'>54709 Willms Station <br />Suite 350, Washington, USA</p>
          <p className='text-gray-500'>Tel: (415) 555-0132 <br />Email: greatstackdev@gmail.com</p>

          <p className='font-semibold text-lg text-gray-600'>Careers at VAIDYAM</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>

          <motion.button 
            className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'
            onClick={()=>navigate('/jobs')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          >
            Explore Jobs
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Contact
