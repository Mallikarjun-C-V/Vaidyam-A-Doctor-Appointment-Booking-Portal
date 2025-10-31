import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js";


const changeAvailability = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: "Availability changed" })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])

        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API for the doctor login
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {

            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)

            res.json({ success: true, token })

        } else {
            return res.json({ success: false, message: "Invalid Credentials" })

        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// API to get  doctor appointments for doctor panel

const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    // Optionally tag expired appointments
    const withExpiryInfo = appointments.map((a) => ({
      ...a._doc,
      expired: isAppointmentExpired(a),
    }));

    res.json({ success: true, appointments: withExpiryInfo });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API to mark appointment completed for doctor panel

const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.docId !== docId) {
      return res.json({ success: false, message: "Mark Failed" });
    }

    // ✅ Allow marking completed even if expired
    const expired = isAppointmentExpired(appointmentData);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
      cancelled: false,
    });

    res.json({
      success: true,
      message: expired
        ? "Appointment marked completed (after scheduled time)"
        : "Appointment marked completed",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API to cancel appointment for doctor panel

const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.docId !== docId) {
      return res.json({ success: false, message: "Cancellation Failed" });
    }

    // ✅ Allow cancellation even after time expired
    const expired = isAppointmentExpired(appointmentData);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
      isCompleted: false,
    });

    res.json({
      success: true,
      message: expired
        ? "Appointment cancelled (after scheduled time)"
        : "Appointment cancelled successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API to get dashboard data for doctor panel

const doctorDashboard = async (req, res) => {

    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// api to get doctor proile for Doctor panel

const doctorProfile = async (req, res) => {

    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// API to update doctor profile data from Doctor Panel

const updateDoctorProfile = async (req, res) => {

    try {

        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })
        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Helper to check if appointment is expired (now > startTime + 30min)
const isAppointmentExpired = (appointment) => {
  try {
    const [day, month, year] = appointment.slotDate.split('_');
    const appointmentStart = new Date(`${month} ${day}, ${year} ${appointment.slotTime}`);

    // Add 30 minutes to the start time
    const appointmentEnd = new Date(appointmentStart.getTime() + 30 * 60000);

    // Compare current time with appointment end time
    return new Date() > appointmentEnd;
  } catch (err) {
    console.error("Error checking appointment expiration:", err);
    return false;
  }
};



export {
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    isAppointmentExpired
}