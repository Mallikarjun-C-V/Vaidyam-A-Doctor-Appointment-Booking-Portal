import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
    const { aToken } = useContext(AdminContext)

    return (
        <div className='sticky top-0 min-h-screen bg-white border-r border-gray-200 w-64 flex-shrink-0'>
            {
                aToken && (
                    <div className='py-6'>
                        {/* Sidebar Header */}
                        <div className='px-6 mb-10'>
                            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 drop-shadow-lg transform transition-transform duration-300 hover:scale-105">
                                Admin Panel
                            </h2>
                            <p className='text-sm text-gray-500 mt-1'>Manage your clinic</p>
                        </div>

                        <ul className='space-y-1 px-3'>
                            <NavLink
                                className={({ isActive }) => `
                                flex items-center gap-3 py-3.5 px-4 rounded-lg cursor-pointer
                                transition-all duration-200 ease-in-out
                                ${isActive
                                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                                    }
                            `}
                                to={'/admin-dashboard'}
                            >
                                <img src={assets.home_icon} alt="" className='w-5 h-5' />
                                <p className='font-medium text-sm'>Dashboard</p>
                            </NavLink>

                            <NavLink
                                className={({ isActive }) => `
                                flex items-center gap-3 py-3.5 px-4 rounded-lg cursor-pointer
                                transition-all duration-200 ease-in-out
                                ${isActive
                                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                                    }
                            `}
                                to={'/all-appointments'}
                            >
                                <img src={assets.appointment_icon} alt="" className='w-5 h-5' />
                                <p className='font-medium text-sm'>Appointments</p>
                            </NavLink>

                            <NavLink
                                className={({ isActive }) => `
                                flex items-center gap-3 py-3.5 px-4 rounded-lg cursor-pointer
                                transition-all duration-200 ease-in-out
                                ${isActive
                                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                                    }
                            `}
                                to={'/add-doctors'}
                            >
                                <img src={assets.add_icon} alt="" className='w-5 h-5' />
                                <p className='font-medium text-sm'>Add Doctor</p>
                            </NavLink>

                            <NavLink
                                className={({ isActive }) => `
                                flex items-center gap-3 py-3.5 px-4 rounded-lg cursor-pointer
                                transition-all duration-200 ease-in-out
                                ${isActive
                                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                                    }
                            `}
                                to={'/doctor-list'}
                            >
                                <img src={assets.people_icon} alt="" className='w-5 h-5' />
                                <p className='font-medium text-sm'>Doctors List</p>
                            </NavLink>
                        </ul>
                    </div>
                )}
        </div>
    )
}

export default Sidebar