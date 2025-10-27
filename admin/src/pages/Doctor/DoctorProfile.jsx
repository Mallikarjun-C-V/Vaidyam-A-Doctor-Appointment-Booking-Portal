import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {

    try {

      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available
      }

      const {data} = await axios.post(backendUrl+'/api/doctor/update-profile',updateData,{headers:{dToken}})

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }

  }

  useEffect(() => {
    getProfileData();
  }, [dToken]);

  if (!profileData) return null;

  return (
    <div className=" w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-blue-300 to-indigo-300 rounded-2xl px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">

              {/* Profile Image - Larger */}
              <div className="relative flex-shrink-0">
                <div className="w-44 h-44 bg-primary rounded-2xl p-2">
                  <img
                    src={profileData.image}
                    alt={profileData.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>
                <span
                  className={`absolute bottom-4 right-4 w-5 h-5 rounded-full border-4 border-white shadow-lg ${profileData.available ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                ></span>
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left pb-2">
                <h1 className="text-4xl font-bold mb-2">
                  {profileData.name}
                </h1>
                <p className="text-lg mb-4">
                  {profileData.degree} • {profileData.speciality}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{profileData.experience}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">

            {/* About Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">About Doctor</h2>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-600">
                <p className="text-gray-700 leading-relaxed">
                  {profileData.about}
                </p>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">

              {/* Appointment Fee Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 ${isEdit ? 'bg-emerald-700 animate-pulse' : 'bg-green-600'}`}>
                    {currency}
                  </div>
                  <h3 className="font-semibold text-gray-900">Consultation Fee</h3>
                </div>

                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-3xl font-black text-gray-600">{currency}</span>
                  {isEdit ? (
                    <input
                      type="number"
                      className="text-3xl font-bold text-green-600 bg-white rounded-lg px-3 py-2 border-2 border-green-300 focus:border-green-500 focus:outline-none w-full"
                      value={profileData.fees}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, fees: e.target.value }))}
                    />
                  ) : (
                    <span className="text-3xl font-bold text-green-600">
                      {profileData.fees}
                    </span>
                  )}
                </div>
              </div>


              {/* Availability Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all duration-300 ${isEdit ? 'bg-blue-700 animate-pulse' : 'bg-blue-600'}`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Availability</h3>
                </div>
                <label className="flex items-center gap-3 cursor-pointer mt-4">
                  <div className="relative">
                    <input
                      onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                      type="checkbox"
                      checked={profileData.available}
                      readOnly
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all"></div>
                    <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow transition-transform peer-checked:translate-x-6"></div>
                  </div>
                  <span className={`font-semibold ${profileData.available ? 'text-green-600' : 'text-gray-500'}`}>
                    {profileData.available ? 'Available Now' : 'Not Available'}
                  </span>
                </label>
              </div>

              {/* Address Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all duration-300 ${isEdit ? 'bg-pink-600 animate-pulse' : 'bg-purple-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                      <path d="M4 20c1.5-1 4.5-2 8-2s6.5 1 8 2" strokeOpacity="0.5" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Clinic Address</h3>
                </div>

                <div className="mt-4">
                  {isEdit ? (
                    <div className="space-y-2 bg-white/60 backdrop-blur-sm border border-pink-200 rounded-lg p-3 shadow-sm transition-all duration-300">
                      <input type="text" placeholder="Address Line 1" className="w-full bg-white border border-pink-300 rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                        value={profileData.address.line1} onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} />
                      <input type="text" placeholder="Address Line 2" className="w-full bg-white border border-pink-300 rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                        value={profileData.address.line2} onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} />
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{profileData.address.line1}<br />{profileData.address.line2}</p>
                  )}
                </div>
              </div>


            </div>

            {/* Edit Button */}
            <div className="flex justify-center pt-4">
              {
                isEdit
                  ? <button
                    onClick={()=>updateProfile()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>

                  : <button
                    onClick={() => setIsEdit(true)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
              }
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DoctorProfile;