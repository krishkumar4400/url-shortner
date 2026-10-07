import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/auth.controller.js";
import {
  authMiddleware,
  isAuthenticated,
} from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/refresh", refreshAccessToken);

userRouter.use(authMiddleware, isAuthenticated);
userRouter.get("/user", getCurrentUser);
userRouter.post("/logout", logoutUser);

export default userRouter;
