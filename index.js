import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";

// app config
const app = express();
const port = process.env.PORT || 4000;

// app extras
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// connect to DB
connectDB();

// default route
app.get("/", (_, res) => res.send("hello"));

// user routes
app.use("/api/v1/users", userRoutes);

// start app
app.listen(port, () => console.log(`Running at http://127.0.0.1:3000`));