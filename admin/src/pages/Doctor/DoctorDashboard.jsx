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

  // 🔹 Show loader while fetching dashboard data
  if (!dashData) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader message="Loading Dashboard..." />
      </div>
    );
  }

  return (
    <div className="flex justify-center align-middle w-full px-6">
      <div className="m-5 space-y-6">
        {/* ===== Top Summary Cards ===== */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 bg-white p-5 min-w-56 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <img className="w-14" src={assets.earning_icon} alt="Earnings" />
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {currency} {dashData.earnings}
              </p>
              <p className="text-gray-500 text-sm">Earnings</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-5 min-w-56 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="Appointments" />
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {dashData.appointments}
              </p>
              <p className="text-gray-500 text-sm">Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-5 min-w-56 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <img className="w-14" src={assets.patients_icon} alt="Patients" />
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {dashData.patients}
              </p>
              <p className="text-gray-500 text-sm">Patients</p>
            </div>
          </div>
        </div>

        {/* ===== Latest Bookings Section ===== */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-5 py-4 bg-gray-50 border-b">
            <img src={assets.list_icon} alt="Bookings List" className="w-5 h-5" />
            <p className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
              Latest Bookings
            </p>
          </div>

          {/* Bookings List */}
          <div className="divide-y">
            {dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      className="rounded-full w-10 h-10 object-cover"
                      src={item.userData.image}
                      alt={item.userData.name}
                    />
                    <div>
                      <p className="text-gray-800 font-medium text-sm">
                        {item.userData.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {slotDateFormat(item.slotDate)}
                      </p>
                    </div>
                  </div>

                  {/* Status / Actions */}
                  {item.cancelled ? (
                    <p className="text-red-500 text-xs font-semibold">Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className="text-green-600 text-xs font-semibold">Completed</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-8 h-8 cursor-pointer hover:scale-110 transition"
                        src={assets.cancel_icon}
                        alt="Cancel"
                      />
                      <img
                        onClick={() => completeAppointment(item._id)}
                        className="w-8 h-8 cursor-pointer hover:scale-110 transition"
                        src={assets.tick_icon}
                        alt="Complete"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8 text-sm">
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
