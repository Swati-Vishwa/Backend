import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

//Get user data from frontend + Client-Side Validation
//Check Duplicate User / Identity
//Check for images and avatar, if exist - upload on cloudinary
//Create user object - create entry in DB
//password encryption - already handled
//Remove password and refresh token field from response
//Varify user creation, return response upon creation else throw err


const registerUser = asyncHandler(async (req, res) => {

  //Get user data from frontend + Client-Side Validation
  const { username, fullname, email, password } = req.body
  console.log("email: ", email)
  console.log("username: ", username)

  if (
    [username, fullname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  //Check Duplicate User / Identity
  const existingUser = User.find({
    $or: [{ username }, { email }]
  })
  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists")
  }

  //Check for images and avatar, if exist - upload on cloudinary
  const avatarLocalPath = req.files?.Avatar[0]?.path
  const coverImageLocalPath = req.files?.CoverImage[0]?.path
  if (avatarLocalPath) {
    console.log(avatarLocalPath)
  } else {
    throw new ApiError(400, "Avatar is required")
  }
  if (coverImageLocalPath) {
    console.log(coverImageLocalPath)
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImg = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar) throw new ApiError(400, "Couldn't find avatar");
  
  //Create user object - create entry in DB
  const user = await User.create({
    username: username.toLowerCase(),
    fullname,
    email,
    password,
    avatar: avatar.url,
    coverImg: coverImg?.url || ""
  })

  //.select() help unselect items we don't want here in this case password and refreshToken
  const createdUserObject = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if(!createdUserObject){
    throw new ApiError(500, "Failed to retrieve created user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUserObject, "User registered successfully")
  )

});

export { registerUser }