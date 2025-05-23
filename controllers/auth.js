// controllers/auth.js
const User = require("../models/User");

//@desc Register user
//@route POST /api/v1/auth/Register
//@access Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    //Create User
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    //Create token
    //const token = user.getSignedJwtToken();
    //res.status(200).json({success: true, token});
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};

//@desc login user
//@route POST /api/v1/auth/login
//@access Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  //validate email & password
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide an email and password" });
  }

  //check for user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({ success: false, msg: "Invalid credentials" });
  }

  //check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, msg: "Invalid credentials" });
  }

  //Create token
  //const token = user.getSignedJwtToken();
  //res.status(200).json({success:true, token});
  sendTokenResponse(user, 200, res);
};

// @desc Logout user / Clear cookie
// @route GET /api/v1/auth/logout
// @access Private
exports.logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
    msg: "User logged out successfully",
  });
};

//get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

//At the end of file
//@desc Get current Logged in user
//@route POST /api/v1/auth/me
//@access Private
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
};

exports.updatePassword = async (req, res) => {
  try {
      const { userId, newPassword } = req.body;
      if (!userId || !newPassword) {
          return res.status(400).json({ success: false, msg: "Missing required fields" });
      }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, msg: "User not found" });
      }

      user.password = newPassword;
      await user.save();

      res.json({ success: true, msg: "Password updated successfully" });
  } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ success: false, msg: "Error updating password" });
  }
};