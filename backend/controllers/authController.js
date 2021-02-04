const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { promisify } = require("util");

// createtoken
const getToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// gettoken
const sendToken = (user, statusCode, res) => {
  const token = getToken(user._id);

  res.cookie("jwt", token, {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN + 24 * 60 * 60 * 1000
    ),
  });

  user.password = undefined;
  user.__v = undefined;
  user.confirmPassword = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// signup
exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password, confirmPassword } = req.body;
    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
    });

    if (!user) {
      let err = new Error("signup failed");
      err.statusCode = 400;
      return next(err);
    }

    // send response and token
    sendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// signin
exports.signin = async (req, res, next) => {
  try {
    // check if there is email and password
    const { password, email } = req.body;
    if (!password || !email) {
      let err = new Error("Please provide email and password");
      err.statusCode = 400;
      return next(err);
    }

    // check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.checkPassword(password, user.password))) {
      let err = new Error("Incorrect  email or password");
      err.statusCode = 400;
      return next(err);
    }
    // send token
    sendToken(user, 200, res);
  } catch (err) {
    re.status(400).json({ status: "fail", message: err.message });
  }
};

exports.signout = async (req, res, next) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      status: "success",
      message: "Logged out successfull",
    });
  } catch (err) {
    err.statusCode = 400;
    return next(err);
  }
};

exports.access = async (req, res, next) => {
  // 1). check if there is a token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    let err = new Error("Please login to get access.");
    err.statusCode = 401;
    return next(err);
  }

  // 2). verify jwt
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3). check if user exists
  const user = await User.findById(decoded.id);

  if (!user) {
    let err = new Error("user no longer exist.");
    err.statusCode = 401;
    return next(err);
  }

  // 4]. grant access
  req.user = user;
  next();
};
