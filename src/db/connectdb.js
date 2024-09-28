import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.mongodb}/vedioStream`);
    console.log("database connected");
  } catch (error) {
    console.log("error: ", error);
    process.exit();
  }
};
export default connectDB;
