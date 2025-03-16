import User from "../models/User.model.js";
import sendMail from "../utils/email.js";
import { validatePassword, validateEmail } from "../utils/validate.js";
import "dotenv/config";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function registerUser(req, res) {
  // get data
  const { name, email, password } = req.body;

  // validate inputs
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }

  // validate email
  if (!validateEmail(email)) {
    return res.status(400).json({
      message: "Invalid Email",
      success: false,
    });
  }

  // validate password
  if (!validatePassword(password)) {
    return res.status(400).json({
      message: "Password should be more than 6 characters and must have one UpperCase and one LowerCase character",
      success: false,
    });
  }

  try {
    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    // create user in db
    const newUser = await User.create({ name, email, password });
    if (!newUser) {
      return res.status(400).json({
        message: "User not registered",
        success: false,
      });
    }

    // generate verification token
    const token = crypto.randomBytes(Number(process.env.VERIFICATION_TOKEN_SIZE)).toString("hex");

    // store in db
    newUser.verificationToken = token;
    newUser.verificationExpires = Date.now() + Number(process.env.VERIFICATION_TOKEN_EXPIRES);

    // update user in db
    await newUser.save();

    // send to user in email
    const options = {
      receiverMail: newUser.email,
      mailSubject: "Verify Account",
      route: "/verify/",
      token,
      expires: Number(process.env.VERIFICATION_TOKEN_EXPIRES) / 60000,
    };
    await sendMail(options);

    // success status to user
    return res.status(201).json({
      message: "User registered",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error in register user",
      success: false,
    });
  }
}

async function verifyUser(req, res) {
  // get data
  const { token } = req.query;

  // check for token
  if (!token) {
    return res.status(400).json({
      message: "Verification token required",
      success: false,
    });
  }

  try {
    // validate token
    const findUser = await User.findOne({ verificationToken: token });
    if (!findUser) {
      return res.status(400).json({
        message: "Invalid Token",
        success: false,
      });
    }

    // check for password expiry
    if (Date.now() >= findUser.verificationExpires) {
      return res.status(400).json({
        message: "Account verification token expired, please generate new token",
        success: true,
      });
    }

    // set verified status true and reset token
    findUser.isVerified = true;
    findUser.verificationToken = null;
    findUser.verificationExpires = null;

    // save user to db
    await findUser.save();

    // success status to user
    return res.status(200).json({
      message: "Verified Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error in verify user",
      success: false,
    });
  }
}

async function loginUser(req, res) {
  // get data
  const { email, password } = req.body;

  // validate inputs
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }

  try {
    // check if user exists by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid email",
        success: false,
      });
    }

    // validate password
    if ((await bcrypt.compare(password, existingUser.password)) === false) {
      return res.status(400).json({
        message: "Invalid Password",
        success: false,
      });
    }

    // check verification
    if (existingUser.isVerified === false) {
      return res.status(400).json({
        message: "Please verify your email",
        success: false,
      });
    }

    // generate jwt
    const jwtToken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES + "h" });

    // save jwt to cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: Number(process.env.JWT_EXPIRES) * 60 * 60 * 1000,
    };
    res.cookie("fullStackSpeedJsAuthToken", jwtToken, cookieOptions);

    // return success message
    return res.status(200).json({
      message: "Login Successfull",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error in login user",
      success: false,
    });
  }
}

async function getUserDetails(req, res) {
  // check for user id
  if (!req.user) {
    return res.status(400).json({
      message: "User ID required",
      success: false,
    });
  }

  try {
    // check if user exists by email
    const existingUser = await User.findById(req.user.id).select("-password");
    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid email",
        success: false,
      });
    }

    // success message to user with data
    return res.status(200).json({
      message: "User found",
      success: true,
      user: {
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        isVerified: existingUser.isVerified,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error in get user profile",
      success: false,
    });
  }
}

async function forgotPassword(req, res) {
  // get data
  const { email } = req.body;

  // validate
  if (!email) {
    return res.status(400).json({
      message: "Email required",
      success: false,
    });
  }

  try {
    // check if user exists by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid email",
        success: false,
      });
    }

    // generate reset password token
    const token = crypto.randomBytes(Number(process.env.RESET_TOKEN_SIZE)).toString("hex");

    // store token and expires to db
    existingUser.resetPasswordToken = token;
    existingUser.resetPasswordExpires = Date.now() + Number(process.env.RESET_TOKEN_EXPIRES);

    // save user to db
    await existingUser.save();

    // send to user in email
    const options = {
      receiverMail: existingUser.email,
      mailSubject: "Reset Password",
      route: "/reset-password/",
      token,
      expires: Number(process.env.RESET_TOKEN_EXPIRES) / 60000,
    };
    await sendMail(options);

    // success response to user
    return res.status(200).json({
      message: "Reset password token generated",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error in forgot password",
      success: false,
    });
  }
}

async function resetPassword(req, res) {
  // get data
  const { token } = req.query;
  const { newPassword } = req.body;

  // check for token
  if (!token) {
    return res.status(400).json({
      message: "Reset password token required",
      success: false,
    });
  }

  // check for password
  if (!newPassword) {
    return res.status(400).json({
      message: "New password required",
      success: false,
    });
  }

  try {
    // validate token and check for token expiry
    const findUser = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });
    if (!findUser) {
      return res.status(400).json({
        message: "Invalid Token",
        success: false,
      });
    }

    // validate new password
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        message: "Password should be more than 6 characters and must have one UpperCase and one LowerCase character",
        success: false,
      });
    }

    // set password to new password
    findUser.password = newPassword;

    // reset password token and expires
    findUser.resetPasswordToken = null;
    findUser.resetPasswordExpires = null;

    // save user to db
    await findUser.save();

    // success message to user
    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error in reset password",
      success: false,
    });
  }
}

async function logoutUser(_, res) {
  // remove jwt cookie
  res.cookie("fullStackSpeedJsAuthToken", "");

  // success message to user
  return res.status(200).json({
    message: "Logged out successfully",
    success: true,
  });
}

export { registerUser, verifyUser, loginUser, getUserDetails, forgotPassword, resetPassword, logoutUser };
