import mongoose from "mongoose";
import "dotenv/config";

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("Error in connection to DB", err));
}

export default connectDB;
