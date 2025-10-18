import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate();

  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {

      if (state === 'Sign Up') {

        const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }

      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if (token) {
      navigate('/')
    }
  },[token])

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-primary1/10 px-4 relative overflow-hidden"
    >
      {/* Animated background blobs */}
      <div className="absolute w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute w-72 h-72 bg-primary1/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob top-0 right-4"></div>
      <div className="absolute w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob bottom-0 left-20"></div>

      {/* Form container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col gap-4 w-full max-w-md p-8 sm:p-10 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl text-gray-700 relative z-10"
      >
        {/* Logo */}
        <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-primary to-primary1 rounded-2xl flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
            />
          </svg>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-2"
        >
          <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary1 bg-clip-text text-transparent">
            {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
          </p>
          <p className="text-gray-500 mt-1 text-sm">
            Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment
          </p>
        </motion.div>

        {/* Form Fields */}
        {state === 'Sign Up' && (
          <motion.div whileHover={{ scale: 1.02 }} className="w-full relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>

            <div className="relative">
              {/* User Icon */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </div>

              {/* Input */}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="w-full pl-12 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
          </motion.div>
        )}


        <motion.div whileHover={{ scale: 1.02 }} className="w-full relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>

          <div className="relative">
            {/* Icon */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-black"  // solid black
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>

            {/* Input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full pl-12 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition bg-white text-gray-900 placeholder-gray-400"
            />
          </div>
        </motion.div>


        <motion.div whileHover={{ scale: 1.02 }} className="w-full relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>

          <div className="relative">
            {/* Lock Icon */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-black" // solid black
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            {/* Password Input */}
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full pl-12 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition bg-white text-gray-900 placeholder-gray-400"
            />

            {/* Toggle Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="bg-gradient-to-r from-primary to-primary1 hover:from-primary1 hover:to-primary text-white font-semibold w-full py-2.5 rounded-lg text-base shadow-lg transition-all"
        >
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </motion.button>

        {/* Toggle State */}
        <div className="text-center text-sm mt-2">
          {state === 'Sign Up' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setState('Login')}
                className="text-primary font-medium underline cursor-pointer hover:text-primary1 ml-1"
              >
                Login here
              </button>
            </p>
          ) : (
            <p>
              New here?{' '}
              <button
                type="button"
                onClick={() => setState('Sign Up')}
                className="text-primary font-medium underline cursor-pointer hover:text-primary1 ml-1"
              >
                Create one
              </button>
            </p>
          )}
        </div>

      </motion.div>
    </form >
  );
};

export default Login;
