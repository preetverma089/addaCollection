const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error("Please provide valid mongodb connection string");
}
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("db connected succesfully");
  } catch (error) {
    console.log("mongodb connect error", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
