import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'

const Jobs = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-gray-50 text-gray-700"
    >
      {/* Heading */}
      <motion.div 
        className='text-center text-2xl pt-10 text-gray-500'
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <p>CAREERS AT <span className='text-gray-700 font-semibold'>VAIDYAM</span></p>
      </motion.div>

      {/* No Jobs Section */}
      <motion.div 
        className='text-center mt-10 px-6'
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <motion.img 
          src={assets.no_jobs_image || assets.contact_image} 
          alt="No Jobs"
          className="w-full max-w-[400px] mx-auto rounded-lg shadow-sm"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 150 }}
        />
        <h2 className='text-xl font-semibold mt-6 text-gray-700'>No Current Openings</h2>
        <p className='text-gray-500 mt-2'>
          Thank you for your interest in joining <span className='font-semibold'>Vaidyam</span>. 
          We currently do not have any open positions, but we’re always looking for talented 
          individuals who are passionate about healthcare and technology.
        </p>
      </motion.div>

      {/* Working Culture Section */}
      <motion.div 
        className="max-w-4xl mx-auto mt-16 px-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Why Work at Vaidyam?</h3>
        <p className="text-gray-500 leading-relaxed">
          At Vaidyam, we’re committed to transforming healthcare through innovation. 
          Our team is made up of doctors, engineers, designers, and creators working 
          together to make appointment booking seamless for everyone.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <h4 className="font-semibold mb-2">Collaborative Culture</h4>
            <p className="text-sm text-gray-500">Work alongside skilled professionals who value teamwork, transparency, and growth.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <h4 className="font-semibold mb-2">Learning Environment</h4>
            <p className="text-sm text-gray-500">We encourage learning through mentorship, workshops, and innovative projects.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <h4 className="font-semibold mb-2">Purpose-Driven Work</h4>
            <p className="text-sm text-gray-500">Contribute to meaningful healthcare solutions that make real impact in patients’ lives.</p>
          </div>
        </div>
      </motion.div>

      {/* Contact HR Section */}
      <motion.div 
        className="text-center my-20 px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        viewport={{ once: true }}
      >
        <p className="text-gray-500 mb-3">Want to get in touch with our hiring team?</p>
        <a 
          href="mailto:careers@vaidyam.com" 
          className="inline-block border border-black px-8 py-3 text-sm hover:bg-black hover:text-white transition-all duration-300"
        >
          Email vaidyam@gmail.com
        </a>
      </motion.div>
    </motion.div>
  )
}

export default Jobs
