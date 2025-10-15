import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General Physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const { backendUrl, aToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {

      if (!docImg) {
        return toast.error('Please upload doctor image')
      }

      const formData = new FormData()

      formData.append('doc_img', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', fees)
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      // console.log(...formData)
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      })

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: {
            atoken: aToken  
          }
        }
      );

      if (data.success) {
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setEmail('')
        setPassword('')
        setExperience('1 year')
        setFees('')
        setAbout('')
        setSpeciality('General Physician')
        setDegree('')
        setAddress1('')
        setAddress2('')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.error('API Error:', error);
      if (error.response) {
        // Server responded with an error
        toast.error(error.response.data.message || 'Something went wrong');
      } else if (error.request) {
        // Request was made but no response received
        toast.error('No response from server. Please check your internet connection.');
      } else {
        // Error in request setup
        toast.error('Error in making request. Please try again.');
      }
    }

  }


  return (
    <form onSubmit={onSubmitHandler} className="max-w-5xl mx-auto bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-8 mt-10 mb-10 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Add Doctor</h2>

      {/* Upload Section */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <label htmlFor="doc_img" className="cursor-pointer bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-blue-300 rounded-xl p-6 transition flex items-center justify-center">
            {docImg ? (
              <img src={URL.createObjectURL(docImg)} alt="Doctor Preview" className="w-28 h-28 object-cover rounded-lg" />
            ) : (
              <img src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="upload" className="w-28 h-28 object-contain" />
            )}
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc_img" hidden />
          <p className="text-gray-600 text-sm text-center">Upload doctor <br /> picture</p>
        </div>

        {/* Form Fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Doctor Name</p>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Doctor Email</p>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Doctor Password</p>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Experience</p>
              <select value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 outline-none">
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1} Year`}>{i + 1} Year</option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Fees</p>
              <input type="number" placeholder="Fees" value={fees} onChange={(e) => setFees(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Speciality</p>
              <select value={speciality} onChange={(e) => setSpeciality(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 outline-none">
                <option>General Physician</option>
                <option>Gynecologist</option>
                <option>Dermatologist</option>
                <option>Pediatrician</option>
                <option>Neurologist</option>
                <option>Gastroenterologist</option>
              </select>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Education</p>
              <input type="text" placeholder="Education" value={degree} onChange={(e) => setDegree(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Address</p>
              <input type="text" placeholder="Address 1" value={address1} onChange={(e) => setAddress1(e.target.value)} required className="w-full px-4 py-2 mb-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" />
              <input type="text" placeholder="Address 2" value={address2} onChange={(e) => setAddress2(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>
          </div>
        </div>
      </div>

      {/* About Doctor */}
      <div className="mt-8">
        <p className="text-sm font-medium text-gray-700 mb-2">About Doctor</p>
        <textarea placeholder="Write about doctor..." rows={5} value={about} onChange={(e) => setAbout(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none resize-none" />
      </div>

      {/* Submit Button */}
      <div className="text-center mt-8">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95">Add Doctor</button>
      </div>
    </form>
  )
}

export default AddDoctor
