import jwt from "jsonwebtoken";
import env from "../config/env.js";

const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(401).json({
        message: "You're not logged in",
        success: false,
      });
    }

    const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    console.log(decoded);
    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Unauthorized access",
      success: false,
    });
  }
};

const isAuthenticated = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({
      message: "unauthorized access",
      success: false,
    });
  }
  return next();
};

export { authMiddleware, isAuthenticated };
