import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import Loader from '../components/Loader';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';

const Myprofile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const updateUserProfileData = async () => {
    try {
      setUpdateLoading(true);

      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      image && formData.append('image', image);

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setUpdateLoading(false);
    }
  }

  if (!userData) {
    return <Loader message="Loading your Profile" />;
  }

  return (
    <div className="relative">
      {/* Profile content */}
      <motion.div
        className={`max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10 mb-20 transition-all duration-300 ${updateLoading ? 'filter blur-sm pointer-events-none' : ''}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >

        {/* Profile Image */}
        <div>
          {isEdit ? (
<label htmlFor="image">
  <div className="relative cursor-pointer inline-block">
    <img
      className="w-40 h-40 rounded-full object-cover shadow-md border-4 border-white"
      src={image ? URL.createObjectURL(image) : userData.image}
      alt="Profile"
    />
    {/* Upload icon in the center */}
    <img
      className="w-10 h-10 absolute inset-0 m-auto"
      src={assets.upload_icon}
      alt="Upload"
    />
  </div>
  <input
    onChange={(e) => setImage(e.target.files[0])}
    type="file"
    id="image"
    hidden
  />
</label>

          ) : (
            <motion.img
              className="w-40 h-40 rounded-full object-cover shadow-md border-4 border-white"
              src={userData.image}
              alt="Profile"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
              whileHover={{ scale: 1.05 }}
            />
          )}
        </div>

        {/* Name */}
        {isEdit ? (
          <motion.input
            className="bg-gray-50 text-3xl font-semibold max-w-md mt-4 px-3 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent block"
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        ) : (
          <motion.p
            className="font-semibold text-3xl text-gray-800 mt-4 block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {userData.name}
          </motion.p>
        )}

        <hr className="bg-gray-200 h-[2px] border-none my-6" />

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-600 font-semibold text-sm uppercase tracking-wider mb-4">Contact Information</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-4 gap-x-4 text-gray-700">
            <p className="font-medium text-gray-600">Email:</p>
            <p className="text-blue-600 hover:text-blue-700 cursor-pointer">{userData.email}</p>

            <p className="font-medium text-gray-600">Phone:</p>
            {isEdit ? (
              <input className="bg-gray-50 max-w-xs w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" type="text" value={userData.phone}
                onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
            ) : (
              <p className="text-gray-700">{userData.phone}</p>
            )}

            <p className="font-medium text-gray-600">Address:</p>
            {isEdit ? (
              <p className="space-y-2">
                <input className="bg-gray-50 w-full max-w-xs px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" type="text" value={userData.address.line1}
                  onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} />
                <br />
                <input className="bg-gray-50 w-full max-w-xs px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" type="text" value={userData.address.line2}
                  onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} />
              </p>
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {userData.address.line1}<br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </motion.div>

        {/* Basic Info */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-600 font-semibold text-sm uppercase tracking-wider mb-4">Basic Information</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-4 gap-x-4 text-gray-700">
            <p className="font-medium text-gray-600">Gender:</p>
            {isEdit ? (
              <select className="max-w-xs bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer" value={userData.gender}
                onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-700">{userData.gender}</p>
            )}

            <p className="font-medium text-gray-600">Birthday:</p>
            {isEdit ? (
              <input className="max-w-xs bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer" type="date" value={userData.dob}
                onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))} />
            ) : (
              <p className="text-gray-700">{userData.dob}</p>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="mt-10 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {isEdit ? (
            <motion.button
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md"
              onClick={() => updateUserProfileData()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save information
            </motion.button>
          ) : (
            <motion.button
              className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-200 shadow-md"
              onClick={() => setIsEdit(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Edit Profile
            </motion.button>
          )}
        </motion.div>

      </motion.div>

      {/* Loader overlay */}
      {updateLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loader message="Updating photo..." />
        </motion.div>
      )}

    </div>
  );
};

export default Myprofile;
