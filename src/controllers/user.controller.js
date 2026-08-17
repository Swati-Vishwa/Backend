import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async (userId) => {
  try {
    //find user by userId
    const user = await User.findById(userId);
    //Generate access and refresh token
    const accessToken = await User.generateAccessToken();
    const refreshToken = await User.generateRefreshToken();
    //save refreshToken in user data obj
    user.refreshToken = refreshToken
    //save user
    await user.save({ validateBeforeSave: false })

    return (accessToken, refreshToken)

  } catch (error) {
    throw new ApiError(500, "Couldn't generate Access and Referesh tokens")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // For Registration
  //Get user data from frontend + Client-Side Validation
  //Check Duplicate User / Identity
  //Check for images and avatar, if exist - upload on cloudinary
  //Create user object - create entry in DB
  //password encryption - already handled
  //Remove password and refresh token field from response
  //Varify user creation, return response upon creation else throw err

  //Get user data from frontend + Client-Side Validation
  const { username, fullname, email, password } = req.body
  // console.log("req.body", req.body)
  // console.log("email: ", email)
  // console.log("username: ", username)

  if (
    [username, fullname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  //Check Duplicate User / Identity
  const existingUser = await User.find({
    $or: [{ username }, { email }]
  })
  if (!existingUser) {
    throw new ApiError(409, "User with this email or username already exists")
  }

  //Check for images and avatar, if exist - upload on cloudinary
  // console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path
  // const coverImageLocalPath = req.files?.coverImage[0]?.path //No other option incase doesn't exist

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required")
  }

  if (coverImageLocalPath) {
    console.log(coverImageLocalPath)
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) throw new ApiError(400, "Couldn't find avatar");

  //Create user object - create entry in DB
  const user = await User.create({
    username: username.toLowerCase(),
    fullname,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || ""
  })

  //.select() help unselect items we don't want here in this case password and refreshToken
  const createdUserObject = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUserObject) {
    throw new ApiError(500, "Failed to retrieve created user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUserObject, "User registered successfully")
  )

});

const loginUser = asyncHandler(async (req, res) => {
  // Get user details from form (email/username, password)
  // Check if user exists in DB (findOne by email or username)
  // If user doesn't exist -> throw error (ApiError.js)
  // Compare entered password with hashed password in DB (bcrypt.compare)
  // If password doesn't match -> throw error (ApiError.js)
  // If password matches -> generate access and refresh token
  // Send token (cookie/response) + user data (excluding password)

  const { username, email, password } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "Username or Email is required")
  }

  // MongoDB method to find multiple documents by username or email
  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  //if user isn't found throw error
  if (!user) {
    throw new ApiError(401, "User with this username or email doesn't exists")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)
  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
  // Fetch fresh user profile omitting sensitive credentials for the API response
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  //sending cookies 
  const options = {
    //if false frontend can modify it, if true only backend can modify it
    httpOnly: true, // Prevents client-side JS from reading the cookie
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken }, //Incase user wants to save their accessToken and refreshToken
        "User Logged In Successfully"
      )
    )
});
export { registerUser, loginUser }