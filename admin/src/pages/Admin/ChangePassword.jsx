import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";
import Select from "react-select";
import { Eye, EyeOff, Lock, UserCog, Shield, Check, AlertCircle } from "lucide-react";

const ChangePassword = () => {
  const { backendUrl, aToken, getAllDoctors, doctors } = useContext(AdminContext);
  const [doctorId, setDoctorId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (doctors.length === 0) getAllDoctors();
  }, []);

  useEffect(() => {
    calculatePasswordStrength(newPassword);
  }, [newPassword]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  const doctorOptions = doctors.map((doc) => ({
    value: doc._id,
    label: `${doc.name} (${doc.speciality})`,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorId || !newPassword) {
      toast.error("Please select a doctor and enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-doctor-password`,
        { doctorId, newPassword },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setNewPassword("");
        setDoctorId("");
        setPasswordStrength(0);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong while updating password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "0.75rem",
      borderColor: state.isFocused ? "#3B82F6" : "#E5E7EB",
      borderWidth: "2px",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
      "&:hover": { borderColor: "#3B82F6" },
      padding: "4px 8px",
      minHeight: "50px",
      backgroundColor: state.isDisabled ? "#F9FAFB" : "white",
      transition: "all 0.2s ease",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.75rem",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      border: "2px solid #F3F4F6",
      overflow: "hidden",
      zIndex: 30,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3B82F6"
        : state.isFocused
        ? "#EFF6FF"
        : "white",
      color: state.isSelected ? "white" : "#1F2937",
      fontSize: "0.938rem",
      padding: "12px 16px",
      cursor: "pointer",
      transition: "all 0.15s ease",
      "&:active": {
        backgroundColor: "#3B82F6",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9CA3AF",
      fontSize: "0.938rem",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#1F2937",
      fontSize: "0.938rem",
    }),
  };

  return (
    <div className=" flex align-middle min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Change Doctor Password
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Update the password for any doctor account securely and efficiently
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          {/* Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
            {/* Doctor Selection */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <UserCog className="w-4 h-4 mr-2 text-blue-600" />
                Select Doctor
              </label>
              <Select
                options={doctorOptions}
                value={doctorOptions.find((opt) => opt.value === doctorId) || null}
                onChange={(selected) => setDoctorId(selected?.value || "")}
                placeholder="Search or select a doctor..."
                classNamePrefix="react-select"
                styles={customSelectStyles}
                isSearchable
                isClearable
              />
              {doctorId && (
                <div className="flex items-center text-xs text-green-600 mt-2 animate-fadeIn">
                  <Check className="w-3 h-3 mr-1" />
                  Doctor selected
                </div>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Lock className="w-4 h-4 mr-2 text-blue-600" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Password Strength:</span>
                    <span
                      className={`font-semibold ${
                        passwordStrength <= 1
                          ? "text-red-600"
                          : passwordStrength <= 3
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor()} transition-all duration-300 rounded-full`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-3">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-gray-700 space-y-1">
                    <p className="font-semibold text-blue-900 mb-2">Password Requirements:</p>
                    <ul className="space-y-1 pl-1">
                      <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
                        • At least 8 characters long
                      </li>
                      <li className={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? "text-green-600" : ""}>
                        • Contains uppercase and lowercase letters
                      </li>
                      <li className={/\d/.test(newPassword) ? "text-green-600" : ""}>
                        • Contains at least one number
                      </li>
                      <li className={/[^a-zA-Z\d]/.test(newPassword) ? "text-green-600" : ""}>
                        • Contains at least one special character
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !doctorId || !newPassword || newPassword.length < 8}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            All password changes are encrypted and securely stored
          </p>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChangePassword;