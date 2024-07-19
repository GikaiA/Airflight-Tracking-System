import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp as verifyOtpService } from "../services/authService"; // Adjust the path to your service file
import "./VerifyOTP.css"; // Adjust the path to your CSS file

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { usernameOrEmail } = location.state || {}; // Get the usernameOrEmail from the navigation state

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      // Ensure OTP is provided
      if (!otp) {
        setError("Please enter the OTP.");
        return;
      }

      // Call the verify OTP service
      const result = await verifyOtpService(usernameOrEmail, otp);

      // Handle success
      if (result.success) {
        setSuccess("OTP verified successfully!");
        navigate("/dashboard"); // Redirect to the dashboard or desired page
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while verifying OTP. Please try again.");
    }
  };

  return (
    <div className="verify-otp-section">
      <form className="verify-otp-form" onSubmit={handleVerifyOTP}>
        <h2>Verify OTP</h2>
        <label className="verify-otp-label">Enter OTP</label>
        <input
          type="text"
          placeholder="Enter OTP"
          className="verify-otp-field"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <button type="submit" className="verify-otp-form-button">Verify OTP</button>
      </form>
    </div>
  );
};

export default VerifyOTP;
