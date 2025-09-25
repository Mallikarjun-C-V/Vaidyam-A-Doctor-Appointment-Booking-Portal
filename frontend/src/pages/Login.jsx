import React, { useState } from 'react'

const Login = () => {
  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
  }

  return (
    <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-primary1/10 px-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute w-72 h-72 bg-primary1/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob top-0 right-4"></div>
      <div className="absolute w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob bottom-0 left-20"></div>

      <div className="flex flex-col gap-4 w-full max-w-md p-8 sm:p-10 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl text-gray-700 relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-primary to-primary1 rounded-2xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>

        {/* Title */}
        <div className="text-center mb-2 animate-slide-in">
          <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary1 bg-clip-text text-transparent">
            {state === 'Sign Up' ? "Create Account" : "Welcome Back"}
          </p>
          <p className="text-gray-500 mt-1 text-sm">
            Please {state === 'Sign Up' ? "sign up" : "log in"} to book an appointment
          </p>
        </div>

        {/* Social Login */}
        <div className="flex gap-4 mb-4">
          <button 
            type="button"
            className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 hover:shadow-md"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            <span className="text-sm font-medium">Google</span>
          </button>
          <button 
            type="button"
            className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 hover:shadow-md"
          >
            <img src="https://github.com/favicon.ico" className="w-5 h-5" alt="GitHub" />
            <span className="text-sm font-medium">GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">or continue with</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Form Fields */}
        {state === "Sign Up" && (
          <div className="w-full animate-slide-in">
            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <input 
              className="border border-gray-300 rounded-lg w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition bg-white/50 backdrop-blur-sm" 
              type="text" 
              onChange={(e) => setName(e.target.value)} 
              value={name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </span>
            <input 
              className="pl-10 border border-gray-300 rounded-lg w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition bg-white/50 backdrop-blur-sm" 
              type="email" 
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
              required
            />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input 
              className="pl-10 border border-gray-300 rounded-lg w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition bg-white/50 backdrop-blur-sm" 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              value={password}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          className="bg-gradient-to-r from-primary to-primary1 hover:from-primary1 hover:to-primary text-white font-semibold w-full py-2.5 rounded-lg text-base shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {state === 'Sign Up' ? "Create Account" : "Login"}
        </button>

        {/* Toggle State */}
        <div className="text-center text-sm mt-2">
          {state === "Sign Up" ? (
            <p>
              Already have an account? 
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
              New here? 
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

        {/* Password Recovery */}
        {state === 'Login' && (
          <p className="text-center text-sm text-gray-500">
            Forgot your password? 
            <button 
              type="button"
              className="text-primary hover:text-primary1 ml-1"
            >
              Reset it here
            </button>
          </p>
        )}
      </div>
    </form>
  )
}

export default Login
