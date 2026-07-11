import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log("\n MongoDB connected", connectionInstance.connection.host) // Display the hostname/IP of the MongoDB server we're connected to
  } catch (error) {
    console.log("DB connection error: ",  error)
    process.exit(1) //learn about it later
    alert("ERROR: ", error)
  }
}

export default connectDB