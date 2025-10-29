import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import Loader from '../components/Loader'

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
    const rotateX = ((y - midY) / midY) * 6
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
              onClick={() => {
                if (speciality === spec) navigate('/doctors')
                else navigate(`/doctors/${spec}`)
                setShowFilter(false)
              }}
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
        {/* Doctors Grid */}
        <motion.div
          className="top-doctors-grid w-full gap-8 pt-8 px-3 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          {!filterDoc || filterDoc.length === 0 ? (
            <div className="col-span-full flex justify-center items-center w-full py-20">
              <Loader message="Doctors are Loading" />
            </div>
          ) : (
            filterDoc.map((item, index) => (
              <motion.div
                id={`doctor-card-${index}`}
                key={index}
                onClick={() => navigate(`/appointment/${item._id}`)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => handleMouseLeave(index)}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer shadow-sm transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-2xl hover:border-blue-900 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 relative"
                style={{ transformStyle: 'preserve-3d' }}
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
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${item.available
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${item.available ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
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
            ))
          )}
        </motion.div>

      </div>

      {/* Scoped Grid CSS */}
      <style>
        {`
  .top-doctors-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 1400px) {
    .top-doctors-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 1100px) {
    .top-doctors-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 800px) {
    .top-doctors-grid {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .top-doctors-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 500px) {
    .top-doctors-grid {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }
`}
      </style>

    </motion.div>
  )
}

export default Doctors
