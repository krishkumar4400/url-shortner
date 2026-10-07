import { Router } from "express";
import { getAllUrl, redirectUrl, shortUrl } from "../controllers/url.controller.js";

const urlRouter = Router();

urlRouter.post("/new", shortUrl);
urlRouter.get("/all", getAllUrl);
urlRouter.get("/:shortCode", redirectUrl)

export default urlRouter;
