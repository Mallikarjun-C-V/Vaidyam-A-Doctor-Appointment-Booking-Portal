import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    else setFilterDoc(doctors)
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  // Mouse tilt handler
  const handleMouseMove = (e, index) => {
    const card = document.getElementById(`doctor-card-${index}`)
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const midX = rect.width / 2
    const midY = rect.height / 2

    const rotateX = ((y - midY) / midY) * 6 // subtle tilt
    const rotateY = ((x - midX) / midX) * -6

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
  }

  const handleMouseLeave = (index) => {
    const card = document.getElementById(`doctor-card-${index}`)
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Page Heading */}
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-gray-800 text-center sm:text-left mb-2"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        Our Specialists
      </motion.h1>
      <motion.p
        className="text-lg text-gray-600 text-center sm:text-left"
        initial={{ y: -10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      >
        Browse through the doctor's specialties and book your appointment.
      </motion.p>

      <div className="flex flex-col sm:flex-row items-start gap-8 mt-8">
        {/* Filters Toggle on Mobile */}
        <button
          className={`py-2 px-5 border rounded-lg text-sm font-semibold shadow-sm transition-all sm:hidden ${showFilter ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700'}`}
          onClick={() => setShowFilter(prev => !prev)}
        >
          {showFilter ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filter Sidebar */}
        <motion.div
          className={`flex-col gap-3 text-sm text-gray-600 w-full sm:w-60 ${showFilter ? 'flex' : 'hidden sm:flex'}`}
          initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Specialties</h2>
          {[
            'General physician',
            'Gynecologist',
            'Dermatologist',
            'Pediatricians',
            'Neurologist',
            'Gastroenterologist'
          ].map((spec, i) => (
            <p
              key={i}
              onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
              className={`px-4 py-2 rounded-lg border transition-all cursor-pointer font-medium ${speciality === spec
                ? 'bg-indigo-600 text-white shadow-md'
                : 'hover:bg-gray-100'
                }`}
            >
              {spec}
            </p>
          ))}
        </motion.div>

        {/* Doctors Grid */}
        <motion.div
          className="w-full grid grid-cols-auto gap-6 pt-8 gap-y-8 px-3 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          {filterDoc.map((item, index) => (
            <motion.div
              id={`doctor-card-${index}`}
              key={index}
              onClick={() => navigate(`/appointment/${item._id}`)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:shadow-2xl hover:border-blue-400 relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img
                className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full h-48 object-cover"
                src={item.image}
                alt={item.name}
              />
              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium mb-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <p>Available</p>
                </div>
                <p className="text-gray-900 text-xl font-semibold mb-1 group-hover:text-blue-600 transition-colors duration-300">
                  {item.name}
                </p>
                <p className="text-gray-500 text-sm font-medium">{item.speciality}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Doctors
