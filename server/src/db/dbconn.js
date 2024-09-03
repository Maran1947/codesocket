import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectDB = () =>
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("[mongodb] connected successfully..."))
    .catch((err) => console.log(err));

export default connectDB;
