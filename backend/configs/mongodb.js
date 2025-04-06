import mongoose from "mongoose";

// connect to db

const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("database connected"));

  await mongoose.connect(`${process.env.MONGODB_URI}/sklad`);
};
export default connectDB;
