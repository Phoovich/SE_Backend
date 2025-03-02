//routes/auth.js

const express = require("express");
const { register, login, getMe, logout, updatePassword } = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", logout);
router.put("/updatepassword", updatePassword);
module.exports = router;
