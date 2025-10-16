import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const About = () => {
  return (
    <div className="px-6 md:px-12 lg:px-20">
        
        {/* Section Heading */}
        <motion.div 
          className="text-center text-3xl pt-12 text-gray-400 tracking-wider"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p>
            ABOUT <span className="text-gray-800 font-bold">US</span>
          </p>
          <motion.div 
            className="mt-3 h-1 w-20 bg-primary mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          ></motion.div>
        </motion.div>

        {/* About Section */}
        <motion.div 
          className="my-14 flex flex-col md:flex-row gap-12 items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.img 
            className="w-full md:max-w-[360px] rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-300" 
            src={assets.about_image} 
            alt="About Us" 
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />

          <motion.div 
            className="flex flex-col justify-center gap-6 md:w-2/4 text-[15px] text-gray-600 leading-relaxed"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
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
          </motion.div>
        </motion.div>

        {/* Why Choose Us Heading */}
        <motion.div 
          className="text-center text-2xl my-12 tracking-wide"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <p>
            WHY <span className="text-gray-800 font-bold">CHOOSE US</span>
          </p>
          <motion.div 
            className="mt-2 h-1 w-16 bg-primary mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          ></motion.div>
        </motion.div>

        {/* Features */}
        <motion.div 
          className="grid gap-8 md:grid-cols-3 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.2, duration: 0.6, ease: "easeOut" }
            }
          }}
        >
          {[
            { title: "⚡ Efficiency", desc: "Streamlined appointment scheduling that fits into your busy lifestyle." },
            { title: "🚀 Convenience", desc: "Access to a network of trusted healthcare professionals in your area." },
            { title: "💡 Personalization", desc: "Tailored recommendations and reminders to help you stay on top of your health." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="border rounded-xl px-8 py-10 flex flex-col gap-5 text-sm shadow-sm hover:shadow-lg bg-white hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.05, rotate: -1 }}
              transition={{ type: "spring", stiffness: 180, damping: 12 }}
            >
              <b className="text-lg">{feature.title}</b>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

    </div>
  )
}

export default About
