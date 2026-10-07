import { Router } from "express";
import {
  getAllUrl,
  redirectUrl,
  shortUrl,
} from "../controllers/url.controller.js";
import {
  authMiddleware,
  isAuthenticated,
} from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const urlRouter = Router();

urlRouter.post("/new", authMiddleware, isAuthenticated, shortUrl);
urlRouter.get("/all", authMiddleware, isAuthenticated, isAdmin, getAllUrl);
urlRouter.get("/:shortCode", redirectUrl);

export default urlRouter;
