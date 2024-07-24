const express = require("express");
const router = express.Router();
const notp = require("notp");
const base32 = require("thirty-two");
const QRCode = require("qrcode");
const User = require("../models/User");

// User registration route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    // Generate 2FA secret
    const secret = base32.encode(notp.totp.gen());
    const newUser = new User({
      username,
      email,
      password,
      twoFactorSecret: secret,
      twoFactorEnabled: false, // Add this field to user schema if it doesn't exist
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "Registration successful", userId: newUser._id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
});

// Endpoint for generating 2FA QR code
router.get("/generate-qr/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpauthUrl = `otpauth://totp/AirflightTracker?secret=${user.twoFactorSecret}&issuer=AirflightTracker`;
    QRCode.toDataURL(otpauthUrl, (err, url) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to generate QR code", error: err.message });
      }
      res.status(200).json({ qrCodeUrl: url });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to generate QR code", error: error.message });
  }
});

// User login route
router.post("/login", async (req, res) => {
  const { username, password, otp } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email: username }, { username: username }] });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if 2FA is enabled and verify OTP
    if (user.twoFactorEnabled === 'true') {
      const verified = notp.totp.verify(otp, user.twoFactorSecret);
      if (!verified) {
        return res.status(401).json({ message: "Invalid OTP" });
      }
    }

    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Verify OTP route for user
router.post("/verify-otp", async (req, res) => {
  const { username, otp } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: username }, { username: username }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const verified = notp.totp.verify(otp, user.twoFactorSecret);

    if (!verified) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP verified", userId: user._id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
});

module.exports = router;
