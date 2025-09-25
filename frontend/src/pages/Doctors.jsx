import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {

  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    }
    else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center sm:text-left mb-2">Our Specialists</h1>
      <p className="text-lg text-gray-600 text-center sm:text-left">Browse through the doctor's specialties and book your appointment.</p>
      
      <div className='flex flex-col sm:flex-row items-start gap-8 mt-8'>
        
        {/* Filters Toggle on Mobile */}
        <button 
          className={`py-2 px-5 border rounded-lg text-sm font-semibold shadow-sm transition-all sm:hidden ${showFilter ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700'}`} 
          onClick={() => setShowFilter(prev => !prev)}
        >
          {showFilter ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filter Sidebar */}
        <div className={`flex-col gap-3 text-sm text-gray-600 w-full sm:w-60 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Specialties</h2>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`px-4 py-2 rounded-lg border transition-all cursor-pointer font-medium ${speciality === "General physician" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-gray-100"}`}>General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`px-4 py-2 rounded-lg border transition-all cursor-pointer font-medium ${speciality === "Gynecologist" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-gray-100"}`}>Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`px-4 py-2 rounded-lg border transition-all cursor-pointer font-medium ${speciality === "Dermatologist" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-gray-100"}`}>Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`px-4 py-2 rounded-lg border transition-all cursor-pointer font-medium ${speciality === "Pediatricians" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-gray-100"}`}>Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`px-4 py-2 rounded-lg border transition-all cursor-pointer font-medium ${speciality === "Neurologist" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-gray-100"}`}>Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`px-4 py-2 rounded-lg border transition-all cursor-pointer font-medium ${speciality === "Gastroenterologist" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-gray-100"}`}>Gastroenterologist</p>
        </div>

        {/* Doctors Grid */}
            <div className="w-full grid grid-cols-auto gap-6 pt-8 gap-y-8 px-3 sm:px-0">
          {filterDoc.map((item, index) => (
                    <div
                        onClick={() => navigate(`/appointment/${item._id}`)}
                        key={index}
                        className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:translate-y-[-8px] hover:shadow-2xl hover:border-blue-400 relative"
                    >
                        <img className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full h-48 object-cover" src={item.image} alt="" />
                        <div className="p-5">
                            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium mb-3">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <p>Available</p>
                            </div>
                            <p className="text-gray-900 text-xl font-semibold mb-1 group-hover:text-blue-600 transition-colors duration-300">{item.name}</p>
                            <p className="text-gray-500 text-sm font-medium">{item.speciality}</p>
                        </div>
                    </div>
                ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors
