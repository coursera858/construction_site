import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

import { globalErrorHandler } from "./utils/GlobalError.js";

import AuthRouter from "./routers/User.Route.js"
import AssetRouter from "./routers/Asset.Route.js"
import BookingRouter from "./routers/Booking.Route.js"
import BookingTransactionRouter from "./routers/Booking.Transaction.Route.js"
import ProjectRouter from "./routers/Project.Route.js"
import ProjectTransactionRouter from "./routers/Project.Transaction.Route.js"


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "server is healthy",
  });
});

app.use("/api/v1/auth",AuthRouter)
app.use("/api/v1/assets",AssetRouter)
app.use("/api/v1/booking",BookingRouter)
app.use("/api/v1/booking",BookingTransactionRouter)
app.use("/api/v1/project",ProjectRouter)
app.use("/api/v1/project",ProjectTransactionRouter)

app.use(globalErrorHandler);

export default app;
