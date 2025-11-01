import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loader from "../../components/Loader"; // adjust path if needed

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    getDashdata,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) getDashdata();
  }, [dToken]);

  if (!dashData) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen bg-gray-50">
        <Loader message="Loading Dashboard..." />
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full px-6 py-10 bg-gray-50">
      <div className="w-full max-w-6xl space-y-8">
        {/* ===== Top Summary Cards ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Earnings */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all">
            <div className="bg-green-100 p-3 rounded-full">
              <img className="w-10" src={assets.earning_icon} alt="Earnings" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {currency} {dashData.earnings}
              </p>
              <p className="text-gray-500 text-sm mt-1">Total Earnings</p>
            </div>
          </div>

          {/* Appointments */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all">
            <div className="bg-blue-100 p-3 rounded-full">
              <img className="w-10" src={assets.appointments_icon} alt="Appointments" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{dashData.appointments}</p>
              <p className="text-gray-500 text-sm mt-1">Total Appointments</p>
            </div>
          </div>

          {/* Patients */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all">
            <div className="bg-purple-100 p-3 rounded-full">
              <img className="w-10" src={assets.patients_icon} alt="Patients" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{dashData.patients}</p>
              <p className="text-gray-500 text-sm mt-1">Total Patients</p>
            </div>
          </div>
        </div>

        {/* ===== Latest Bookings Section ===== */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-100 to-gray-100 border-b">
            <img src={assets.list_icon} alt="Bookings List" className="w-5 h-5 opacity-80" />
            <p className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
              Latest Bookings
            </p>
          </div>

          {/* Bookings List */}
          <div className="divide-y divide-gray-100">
            {dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      className="rounded-full w-10 h-10 object-cover ring-2 ring-gray-100"
                      src={item.userData.image}
                      alt={item.userData.name}
                    />
                    <div>
                      <p className="text-gray-800 font-medium text-sm">{item.userData.name}</p>
                      <p className="text-gray-500 text-xs">
                        {slotDateFormat(item.slotDate)}
                      </p>
                    </div>
                  </div>

                  {/* Status / Actions */}
                  {item.cancelled ? (
                    <p className="text-red-500 text-xs cursor-pointer font-semibold bg-red-50 px-2 py-1 rounded-full">
                      Cancelled
                    </p>
                  ) : item.isCompleted ? (
                    <p className="text-green-600 text-xs cursor-pointer font-semibold bg-green-50 px-2 py-1 rounded-full">
                      Completed
                    </p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                        src={assets.cancel_icon}
                        alt="Cancel"
                      />
                      <img
                        onClick={() => completeAppointment(item._id)}
                        className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                        src={assets.tick_icon}
                        alt="Complete"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10 text-sm">
                No recent appointments found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
