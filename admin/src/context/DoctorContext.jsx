import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setappointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // ✅ Fetch all doctor appointments
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/appointments", {
        headers: { dToken },
      });

      if (data.success) {
        setappointments(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ✅ Fetch dashboard data
  const getDashdata = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { dToken },
      });

      if (data.success) {
        setDashData(data.dashData);
        console.log("Dashboard data:", data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ✅ Mark appointment as completed (instant update + backend sync)
  const completeAppointment = async (appointmentId) => {
    try {
      // 🔹 Optimistic UI update
      setDashData((prev) => ({
        ...prev,
        latestAppointments: prev.latestAppointments.map((a) =>
          a._id === appointmentId
            ? { ...a, isCompleted: true, cancelled: false }
            : a
        ),
      }));

      // 🔹 Send to backend
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        // 🔹 Re-fetch latest data for consistency
        getAppointments();
        getDashdata();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ✅ Cancel appointment (instant update + backend sync)
  const cancelAppointment = async (appointmentId) => {
    try {
      // 🔹 Optimistic UI update
      setDashData((prev) => ({
        ...prev,
        latestAppointments: prev.latestAppointments.map((a) =>
          a._id === appointmentId
            ? { ...a, cancelled: true, isCompleted: false }
            : a
        ),
      }));

      // 🔹 Send to backend
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        // 🔹 Re-fetch latest data for consistency
        getAppointments();
        getDashdata();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ✅ Get doctor profile
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { dToken },
      });

      if (data.success) {
        setProfileData(data.profileData);
        console.log("Profile data:", data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    setappointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashdata,
    profileData,
    setProfileData,
    getProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
