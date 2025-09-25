import React, { useState } from 'react'
import { assets } from '../assets/assets.js'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const [token, setToken] = useState(true);

    return (
        <div className='flex items-center justify-between text-sm py-5 mb-5 border-b border-b-gray-200 bg-white/80 backdrop-blur-md sticky top-2 z-50 px-4 md:px-8 shadow-[0_8px_32px_-8px_rgba(95,111,255,0.15),0_0_0_1px_rgba(95,111,255,0.08),0_4px_16px_-4px_rgba(0,0,0,0.06)] rounded-[50px]'> 
        <img onClick={() => {navigate('/'); scrollTo(0,0)}} className='w-44 cursor-pointer hover:scale-105 transition-transform duration-300' src={assets.logo} alt="" />
            <ul className='hidden md:flex items-center gap-8 font-medium'>
                <NavLink to="/" onClick={() => window.scrollTo(0,0)} className="group">
                    {({ isActive }) => (
                        <li className={`py-2 px-1 relative ${isActive ? "text-primary1 font-semibold text-lg" : "hover:text-primary"}`}>
                            HOME
                            <hr className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary1 transition-transform duration-300 ${isActive ? "scale-x-100 h-1" : "scale-x-0 group-hover:scale-x-100"}`} />
                        </li>
                    )}
                </NavLink>
                <NavLink to="/doctors" onClick={() => window.scrollTo(0,0)} className="group">
                    {({ isActive }) => (
                        <li className={`py-2 px-1 relative ${isActive ? "text-primary1 font-semibold text-lg" : "hover:text-primary"}`}>
                            ALL DOCTORS
                            <hr className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary1 transition-transform duration-300 ${isActive ? "scale-x-100 h-1" : "scale-x-0 group-hover:scale-x-100"}`} />
                        </li>
                    )}
                </NavLink>
                <NavLink to="/about" onClick={() => window.scrollTo(0,0)} className="group">
                    {({ isActive }) => (
                        <li className={`py-2 px-1 relative ${isActive ? "text-primary1 font-semibold text-lg" : "hover:text-primary"}`}>
                            ABOUT
                            <hr className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary1 transition-transform duration-300 ${isActive ? "scale-x-100 h-1" : "scale-x-0 group-hover:scale-x-100"}`} />
                        </li>
                    )}
                </NavLink>
                <NavLink to="/contact" onClick={() => window.scrollTo(0,0)} className="group">
                    {({ isActive }) => (
                        <li className={`py-2 px-1 relative ${isActive ? "text-primary1 font-semibold text-lg" : "hover:text-primary"}`}>
                            CONTACT
                            <hr className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary1 transition-transform duration-300 ${isActive ? "scale-x-100 h-1" : "scale-x-0 group-hover:scale-x-100"}`} />
                        </li>
                    )}
                </NavLink>
            </ul>
            <div className='flex items-center gap-4'>
                {
                    token
                        ? <div className='flex items-center gap-3 cursor-pointer group relative'>
                            <img className='w-10 h-10 rounded-full border-2 border-gray-200 hover:border-primary transition-colors duration-300 object-cover' src={assets.profile_pic} alt="" />
                            <img className='w-2.5 group-hover:rotate-180 transition-transform duration-300' src={assets.dropdown_icon} alt="" />
                            <div className='absolute top-full right-0 mt-3 text-base font-medium text-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2'>
                                <div className='min-w-56 bg-white rounded-lg shadow-xl border border-gray-100 flex flex-col p-2'>
                                    <p onClick={() => navigate('my-profile')} className='hover:bg-gray-50 hover:text-primary px-4 py-3 rounded-md cursor-pointer transition-all duration-200 flex items-center gap-3'>
                                        <span className='text-lg'>👤</span> My Profile
                                    </p>
                                    <p onClick={() => navigate('my-appointments')} className='hover:bg-gray-50 hover:text-primary px-4 py-3 rounded-md cursor-pointer transition-all duration-200 flex items-center gap-3'>
                                        <span className='text-lg'>📅</span> My Appointments
                                    </p>
                                    <p onClick={() => setToken(false)} className='hover:bg-red-50 hover:text-red-600 px-4 py-3 rounded-md cursor-pointer transition-all duration-200 flex items-center gap-3'>
                                        <span className='text-lg'>🚪</span> Logout
                                    </p>
                                </div>
                            </div>
                        </div>
                        : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-medium hidden md:block hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden group'>
                            <span className='relative z-10'>Create account</span>
                            <div className='absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
                        </button>
                }
                <img onClick={() => setShowMenu(true)} className='w-6 md:hidden cursor-pointer' src={assets.menu_icon} alt="" />
                
                {/* mobile menu */}
                <div className={`fixed left-0 right-0 top-0 md:hidden z-50 transition-all duration-500 ease-in-out ${showMenu ? 'visible' : 'invisible'}`}>
                    {/* Backdrop */}
                    <div 
                        className={`fixed inset-0 bg-black transition-opacity duration-500 ${showMenu ? 'opacity-50' : 'opacity-0'}`}
                        onClick={() => setShowMenu(false)}
                    ></div>
                    
                    {/* Menu Panel - slides from top */}
                    <div className={`relative bg-white shadow-2xl transform transition-transform duration-500 ease-out ${showMenu ? 'translate-y-0' : '-translate-y-full'}`}>
                        <div className='flex items-center justify-between px-6 py-6 border-b border-gray-100'>
                            <img className='w-32' src={assets.logo} alt="" />
                            <button 
                                className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200'
                                onClick={() => setShowMenu(false)}
                            >
                                <img className='w-5' src={assets.cross_icon} alt="" />
                            </button>
                        </div>
                        
                        <ul className='flex flex-col py-6'>
                            <NavLink 
                                onClick={() => setShowMenu(false)} 
                                to="/"
                                className={({ isActive }) => `px-6 py-4 text-base font-medium transition-all duration-200 border-l-4 ${isActive ? 'bg-primary/10 text-primary border-primary' : 'border-transparent hover:bg-gray-50 hover:border-gray-300'}`}
                            >
                                HOME
                            </NavLink>
                            <NavLink 
                                onClick={() => setShowMenu(false)} 
                                to="/doctors"
                                className={({ isActive }) => `px-6 py-4 text-base font-medium transition-all duration-200 border-l-4 ${isActive ? 'bg-primary/10 text-primary border-primary' : 'border-transparent hover:bg-gray-50 hover:border-gray-300'}`}
                            >
                                ALL DOCTORS
                            </NavLink>
                            <NavLink 
                                onClick={() => setShowMenu(false)} 
                                to="/about"
                                className={({ isActive }) => `px-6 py-4 text-base font-medium transition-all duration-200 border-l-4 ${isActive ? 'bg-primary/10 text-primary border-primary' : 'border-transparent hover:bg-gray-50 hover:border-gray-300'}`}
                            >
                                ABOUT
                            </NavLink>
                            <NavLink 
                                onClick={() => setShowMenu(false)} 
                                to="/contact"
                                className={({ isActive }) => `px-6 py-4 text-base font-medium transition-all duration-200 border-l-4 ${isActive ? 'bg-primary/10 text-primary border-primary' : 'border-transparent hover:bg-gray-50 hover:border-gray-300'}`}
                            >
                                CONTACT
                            </NavLink>
                        </ul>
                        
                        {/* Mobile menu footer with login/profile */}
                        <div className='px-6 pb-6 border-t border-gray-100 pt-6'>
                            {token ? (
                                <div className='space-y-3'>
                                    <button 
                                        onClick={() => { navigate('/my-profile'); setShowMenu(false); }}
                                        className='w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3'
                                    >
                                        <span className='text-lg'>👤</span> My Profile
                                    </button>
                                    <button 
                                        onClick={() => { navigate('/my-appointments'); setShowMenu(false); }}
                                        className='w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3'
                                    >
                                        <span className='text-lg'>📅</span> My Appointments
                                    </button>
                                    <button 
                                        onClick={() => { setToken(false); setShowMenu(false); }}
                                        className='w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center gap-3'
                                    >
                                        <span className='text-lg'>🚪</span> Logout
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => { navigate('/login'); setShowMenu(false); }}
                                    className='w-full bg-primary text-white py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300'
                                >
                                    Create account
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar