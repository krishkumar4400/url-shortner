import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRouter from "./routes/health.route.js";
import userRouter from "./routes/auth.routes.js";
import urlRouter from "./routes/url.routes.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/url", urlRouter);
app.use("/", urlRouter);

export default app;
