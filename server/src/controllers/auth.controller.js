import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import env from "../config/env.js";

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const isUserExists = await userModel.findOne({ email });
    if (isUserExists) {
      return res.status(409).json({
        message: "Email already exists",
        success: false,
      });
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return res
      .status(201)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
      })
      .json({
        message: "User has been registered successfully",
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          accessToken,
        },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to register user",
      success: false,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
      })
      .json({
        message: "User has been logged in successfully",
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          accessToken,
        },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to login user",
      success: false,
    });
  }
}

async function logoutUser(req, res) {
  try {
    const user = await userModel.findByIdAndUpdate(req.userId, {
      $set: {
        refreshToken: null,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect user id",
        success: false,
      });
    }

    return res.status(200).clearCookie("refreshToken").json({
      message: "User has been logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to logout user",
      success: false,
    });
  }
}

async function getCurrentUser(req, res) {
  try {
    const user = await userModel.findById(req.userId);

    return res.status(200).json({
      message: "User has been fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch user",
      success: false,
    });
  }
}

async function refreshAccessToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "You are not logged in",
        success: false,
      });
    }

    const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
    const user = await userModel
      .findById(decoded.userId)
      .select("+refreshToken");

    if (!user) {
      return res.status(400).json({
        message: "Refresh token is not valid 1",
        success: false,
      });
    }

    if (user.refreshToken !== refreshToken) {
      user.refreshToken = null;
      await user.save();
      return res.status(400).clearCookie("refreshToken").json({
        message: "Refresh token is not valid 2",
        success: false,
      });
    }

    const accessToken = await user.generateAccessToken();
    const newRefreshToken = await user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, { httpOnly: true })
      .json({
        message: "Token has been refreshed successfully",
        success: true,
        data: {
          accessToken,
        },
      });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Unauthorized access",
      success: false,
    });
  }
}

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
};
