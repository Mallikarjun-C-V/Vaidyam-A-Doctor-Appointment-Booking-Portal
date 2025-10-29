import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const cardVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', bounce: 0.3, duration: 0.8 },
  },
}

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()
  const [relDoc, setRelDoc] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      )
      setRelDoc(doctorsData)
    }
  }, [doctors, speciality, docId])

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors To Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* Doctors Grid */}
      <div className="w-full grid grid-cols-auto gap-6 pt-5 gap-y-8 px-3 sm:px-0">
        {relDoc.slice(0, 5).map((item, index) => (
          <motion.div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`)
              scrollTo(0, 0)
            }}
            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer shadow-sm transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-2xl hover:border-blue-900 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 relative"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.5 }}
            variants={cardVariants}
          >
            {/* Doctor Image */}
            <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full h-60 object-cover object-top">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
              />

              {/* Availability Badge */}
              <div className="absolute top-3 right-3">
                <div
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
                    item.available
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.available
                        ? 'bg-emerald-500 animate-pulse'
                        : 'bg-gray-400'
                    }`}
                  ></span>
                  {item.available ? 'Available' : 'Unavailable'}
                </div>
              </div>

              {/* Hover Glow Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent transition-opacity duration-500"></div>
            </div>

            {/* Card Content */}
            <div className="p-6 text-center relative z-10">
              <p className="text-gray-900 text-xl font-semibold mb-1 transition-colors duration-300 group-hover:text-blue-700">
                {item.name}
              </p>
              <p className="text-gray-500 text-sm font-medium mb-4">
                {item.speciality}
              </p>
            </div>

            {/* Outer Glow on Hover */}
            <div className="absolute inset-0 rounded-2xl ring-0 ring-blue-300/40 group-hover:ring-4 transition-all duration-500 pointer-events-none"></div>
          </motion.div>
        ))}
      </div>

      {/* More Button */}
      <motion.button
        onClick={() => {
          navigate('/doctors')
          scrollTo(0, 0)
        }}
        className="
          bg-gradient-to-r from-blue-600 to-indigo-600 text-white
          px-16 py-4 text-lg rounded-full mt-10 shadow-md
          hover:shadow-lg hover:brightness-110 transition-all duration-300
        "
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.6 },
        }}
      >
        ...more
      </motion.button>
    </div>
  )
}

export default RelatedDoctors
