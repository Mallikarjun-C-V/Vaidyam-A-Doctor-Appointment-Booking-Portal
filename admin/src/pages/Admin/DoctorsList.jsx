import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  },[aToken])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10 w-full">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10 w-full">
        <div className="bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
            All Doctors
          </h1>
          <p className="text-blue-100 text-lg text-center">
            Manage and view all registered doctors
          </p>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {
            doctors.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out overflow-hidden group w-full max-w-sm"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Available Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg transition-all duration-300 ${
                      item.available 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {item.available ? '● Available' : '● Unavailable'}
                    </div>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6">
                  {/* Doctor Name */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 text-center">
                    {item.name}
                  </h3>
                  
                  {/* Specialty Badge */}
                  <div className="mb-4 text-center">
                    <span className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-200">
                      {item.speciality}
                    </span>
                  </div>

                  {/* Availability Toggle */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Availability
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer group/toggle">
                      <input 
                        onChange={()=>changeAvailability(item._id)}
                        type="checkbox" 
                        checked={item.available}
                        readOnly
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                    </label>
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></div>
              </div>
            ))
          }
        </div>

        {/* Empty State */}
        {doctors.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-xl text-gray-500 font-medium">No doctors found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorsList