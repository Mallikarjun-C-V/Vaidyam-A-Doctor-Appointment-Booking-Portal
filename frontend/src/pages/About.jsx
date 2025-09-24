import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="px-6 md:px-12 lg:px-20">
        
        {/* Section Heading */}
        <div className="text-center text-3xl pt-12 text-gray-400 tracking-wider">
          <p>
            ABOUT <span className="text-gray-800 font-bold">US</span>
          </p>
          <div className="mt-3 h-1 w-20 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* About Section */}
        <div className="my-14 flex flex-col md:flex-row gap-12 items-center">
          <img 
            className="w-full md:max-w-[360px] rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-300" 
            src={assets.about_image} 
            alt="About Us" 
          />

          <div className="flex flex-col justify-center gap-6 md:w-2/4 text-[15px] text-gray-600 leading-relaxed">
            <p>
              Welcome to <span className="text-primary font-semibold">Vaidyam</span>, your trusted partner in managing your healthcare needs conveniently and efficiently. At Vaidyam, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
            </p>
            <p>
              Vaidyam is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Vaidyam is here to support you every step of the way.
            </p>
            <b className="text-gray-800 text-lg">Our Vision</b>
            <p>
              Our vision at Vaidyam is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
            </p>
          </div>
        </div>

        {/* Why Choose Us Heading */}
        <div className="text-center text-2xl my-12 tracking-wide">
          <p>
            WHY <span className="text-gray-800 font-bold">CHOOSE US</span>
          </p>
          <div className="mt-2 h-1 w-16 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Features */}
        <div className="grid gap-8 md:grid-cols-3 mb-20">
          <div className="border rounded-xl px-8 py-10 flex flex-col gap-5 text-sm shadow-sm hover:shadow-lg bg-white hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
            <b className="text-lg">⚡ Efficiency</b>
            <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
          </div>
          <div className="border rounded-xl px-8 py-10 flex flex-col gap-5 text-sm shadow-sm hover:shadow-lg bg-white hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
            <b className="text-lg">🚀 Convenience</b>
            <p>Access to a network of trusted healthcare professionals in your area.</p>
          </div>
          <div className="border rounded-xl px-8 py-10 flex flex-col gap-5 text-sm shadow-sm hover:shadow-lg bg-white hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
            <b className="text-lg">💡 Personalization</b>
            <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
          </div>
        </div>

    </div>
  )
}

export default About