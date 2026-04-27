const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "mysecretkey";

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", async (req, res) => {
  try {
    const header = req.header("Authorization");

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization
    });

  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
});

module.exports = router;