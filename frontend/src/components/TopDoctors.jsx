import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Loader from "./Loader";

const DoctorCard = ({ item, index }) => {
  const navigate = useNavigate();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [5, -5]);
  const rotateY = useTransform(x, [-50, 50], [-5, 5]);

  return (
    <motion.div
      key={item._id}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer shadow-sm transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-2xl hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50"
      style={{ rotateX, rotateY, perspective: 1000 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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
      {/* Doctor Image */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full h-60 object-cover object-top">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        />

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <div
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 ${
              item.available
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                item.available ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
              }`}
            ></span>
            {item.available ? "Available" : "Unavailable"}
          </div>
        </div>

        {/* Hover Glow Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent transition-opacity duration-500"></div>
      </div>

      {/* Card Content */}
      <div className="p-6 text-center relative z-10">
        <p className="text-gray-900 text-xl font-semibold mb-1 transition-colors duration-300 group-hover:text-blue-700">
          {item.name}
        </p>
        <p className="text-gray-500 text-sm font-medium mb-4">
          {item.speciality}
        </p>

        {/* Hover Button (Hidden on Small Screens) */}
        <div className="hidden sm:flex justify-center">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out shadow-md hover:shadow-lg hover:brightness-110">
            Book Appointment
          </button>
        </div>
      </div>

      {/* Outer Glow on Hover */}
      <div className="absolute inset-0 rounded-2xl ring-0 ring-blue-300/40 group-hover:ring-4 transition-all duration-500 pointer-events-none"></div>
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
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 px-3 sm:px-0">
        {!doctors || doctors.length === 0 ? (
          <div className="col-span-full flex justify-center items-center w-full">
            <Loader message="Doctors are Loading" />
          </div>
        ) : (
          doctors.slice(0, 8).map((item, index) => (
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
