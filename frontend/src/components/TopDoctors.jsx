import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Loader from "./Loader";

// Separate component for each doctor card to fix Hooks issue
const DoctorCard = ({ item, index }) => {
  const navigate = useNavigate();

  // Motion hooks at top level of this component
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [5, -5]);
  const rotateY = useTransform(x, [-50, 50], [-5, 5]);

  return (
    <motion.div
      key={item._id}
      className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden cursor-pointer relative transition-all duration-300 ease-out hover:border-blue-400 hover:shadow-2xl"
      style={{ rotateX, rotateY, perspective: 1000 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.07 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const posX = e.clientX - rect.left - rect.width / 2;
        const posY = e.clientY - rect.top - rect.height / 2;
        x.set(posX);
        y.set(posY);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={() => navigate(`/appointment/${item._id}`)}
    >
      <img
        className="
          bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 
          w-full 
          h-60
          object-cover 
          object-top
        "
        src={item.image}
        alt={item.name}
      />

      <div className="p-5">
        <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-emerald-600' : 'text-gray-600'} font-medium mb-3`}>
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${item.available ? 'bg-emerald-400' : 'bg-gray-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${item.available ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
          </span>
          <p>Available</p>
        </div>
        <p className="text-gray-900 text-xl font-semibold mb-1 group-hover:text-blue-600 transition-colors duration-300">
          {item.name}
        </p>
        <p className="text-gray-500 text-sm font-medium">{item.speciality}</p>
      </div>
    </motion.div>
  );
};

const TopDoctors = () => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();


  return (
    <div className="flex flex-col items-center gap-6 mt-4 my-20 text-gray-900 md:mx-10">
      {/* Heading */}
      <motion.h1
        className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Top Doctors To Book
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="sm:w-1/2 text-center text-base text-gray-600 leading-relaxed"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Simply browse through our extensive list of trusted doctors.
      </motion.p>

      {/* Doctors Grid */}
      <div className="w-full grid grid-cols-auto gap-6 pt-8 gap-y-8 px-3 sm:px-0">
        {!doctors || doctors.length === 0 ? (
          <div className="col-span-full flex justify-center items-center w-full">
            <Loader message="Doctors are Loading" />
          </div>
        ) : (
          doctors.slice(0, 10).map((item, index) => (
            <DoctorCard key={item._id} item={item} index={index} />
          ))
        )}
      </div>


      {/* View All Doctors Button */}
      <motion.button
        onClick={() => {
          navigate("/doctors");
          window.scrollTo(0, 0);
        }}
        className="relative bg-gradient-to-r from-blue-600 to-[#1976D2] text-white px-12 py-4 text-base font-semibold rounded-full mt-8 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-blue-700 hover:to-indigo-700 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.07 }}
      >
        View All Doctors
      </motion.button>
    </div>
  );
};

export default TopDoctors;
