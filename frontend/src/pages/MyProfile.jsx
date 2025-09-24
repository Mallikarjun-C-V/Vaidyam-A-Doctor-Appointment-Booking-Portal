import React, { useState } from 'react';
import { assets } from '../assets/assets'; // make sure this file exports an `assets` object with `profile_pic`

const Myprofile = () => {
  const [userData, setUserData] = useState({
    name: "Bhargav V",
    image: assets.profile_pic,
    email: 'bhargavv@gmail.com',
    phone: "+91 98547 69854",
    address: {
      line1: "5th cross , Saraswathi badavane",
      line2: "Davanagere, Karnataka"
    },
    gender: "Male",
    dob: "2005-06-03" // YYYY-MM-DD works best for <input type="date">
  });

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className='max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10 mb-20'>

      <img className='w-40 h-40 rounded-full object-cover shadow-md border-4 border-white' src={userData.image} alt="Profile" />

      {
        isEdit
          ? <input className='bg-gray-50 text-3xl font-semibold max-w-md mt-6 px-3 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent' type="text" value={userData.name}
                   onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
          : <p className='font-semibold text-3xl text-gray-800 mt-6'>{userData.name}</p>
      }

      <hr className='bg-gray-200 h-[2px] border-none my-6' />

      <div>
        <p className='text-gray-600 font-semibold text-sm uppercase tracking-wider mb-4'>Contact Information</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-4 gap-x-4 text-gray-700'>
          <p className='font-medium text-gray-600'>Email:</p>
          <p className='text-blue-600 hover:text-blue-700 cursor-pointer'>{userData.email}</p>
          <p className='font-medium text-gray-600'>Phone:</p>
          {
            isEdit
              ? <input className='bg-gray-50 max-w-xs w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent' type="text" value={userData.phone}
                       onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
              : <p className='text-gray-700'>{userData.phone}</p>
          }

          <p className='font-medium text-gray-600'>Address:</p>
          {
            isEdit
              ? <p className='space-y-2'>
                  <input className='bg-gray-50 w-full max-w-xs px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent' type="text" value={userData.address.line1}
                         onChange={e => setUserData(prev => ({
                           ...prev,
                           address: { ...prev.address, line1: e.target.value }
                         }))} />
                  <br />
                  <input className='bg-gray-50 w-full max-w-xs px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent' type="text" value={userData.address.line2}
                         onChange={e => setUserData(prev => ({
                           ...prev,
                           address: { ...prev.address, line2: e.target.value }
                         }))} />
                </p>
              : <p className='text-gray-700 leading-relaxed'>
                  {userData.address.line1}
                  <br />
                  {userData.address.line2}
                </p>
          }
        </div>
      </div>

      <div className='mt-8'>
        <p className='text-gray-600 font-semibold text-sm uppercase tracking-wider mb-4'>Basic Information</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-4 gap-x-4 text-gray-700'>
          <p className='font-medium text-gray-600'>Gender:</p>
          {
            isEdit
              ? <select className='max-w-xs bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer' value={userData.gender}
                        onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              : <p className='text-gray-700'>{userData.gender}</p>
          }

          <p className='font-medium text-gray-600'>Birthday:</p>
          {
            isEdit
              ? <input className='max-w-xs bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer' type="date" value={userData.dob}
                       onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))} />
              : <p className='text-gray-700'>{userData.dob}</p>
          }
        </div>
      </div>

      <div className='mt-10 mb-4'>
        {
          isEdit
          ? <button className='bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md' onClick={()=>setIsEdit(false)}>Save information</button>
          : <button className='bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-200 shadow-md' onClick={()=>setIsEdit(true)}>Edit Profile</button>
        }
      </div>

    </div>
  );
};

export default Myprofile;