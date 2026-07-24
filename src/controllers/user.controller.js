import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async(req, res) => {
  res.status(200).json({
    message: "ok"
  })
});
if(registerUser) console.log("yaho", registerUser)

export {registerUser}