import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({
  path: './env'
})

connectDB()
  .then(() => {
    app.on("Error", (error => {
      console.log("ERR: ", error)
    }))
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Listening to server on: ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.log("OOPS! couldn't connect to DB", err)
  })