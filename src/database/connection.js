import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const MONGODB_URL = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGODB_URL);
    console.log(
      `MongoDB Connected !!! DB HOST ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB Connection Error : ", error);
    process.exit(1);
  }
};

export default connectDB;
