import mongoose from "mongoose";
import { DB_name } from "../constants";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.mongodb}/${DB_name}`);
    console.log("database connected");
  } catch (error) {
    console.log("error: ", error);
    process.exit();
  }
};
export default connectDB;
