import userModel from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.userId);
    if (user.role !== "admin") {
      return res.status(401).json({
        message: "You are not authorized to see all the URLs",
        success: false,
      });
    }

    return next();
  } catch (error) {
    console.error("error");
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export default isAdmin;
