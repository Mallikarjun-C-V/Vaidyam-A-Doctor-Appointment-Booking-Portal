import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const cardVariants = {
    offscreen: {
        y: 50,
        opacity: 0
    },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            bounce: 0.3,
            duration: 0.8
        }
    }
}

const RelatedDoctors = ({ speciality, docId }) => {

    const { doctors } = useContext(AppContext)
    const navigate = useNavigate()

    const [relDoc, setRelDoc] = useState([])

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setRelDoc(doctorsData)
        }
    }, [doctors, speciality, docId])

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-medium'>Top Doctors To Book</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>

            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {relDoc.slice(0, 5).map((item, index) => (
                    <motion.div
                        key={index}
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                        className="
                            border border-blue-200 rounded-xl overflow-hidden cursor-pointer
                            hover:bg-[#e0e7ff]      
                            hover:border-blue-500   
                            hover:shadow-md
                        "
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={cardVariants}
                    >
                        <img className="bg-blue-50 w-full h-48 object-cover" src={item.image} alt={item.name} />
                        <div className="p-4">
                            <div className={`flex items-end gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                                <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full my-1`}></p>
                                <p>Available</p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                            <p className='text-gray-600 text-sm'>{item.speciality}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.button
                onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
                className="
                    bg-blue-50 text-gray-600
                    px-16 py-4            
                    text-lg                 
                    rounded-full mt-10
                    hover:bg-blue-100
                    hover:text-gray-800
                    hover:shadow-md
                    hover:scale-105
                "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
            >
                ...more
            </motion.button>
        </div>
    )
}

export default RelatedDoctors
