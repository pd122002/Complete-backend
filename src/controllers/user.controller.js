import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) =>{
   // get user details from frontend
   // validation - not empty
   // check if user already exist:username se bhi and email se bhi
   // check for images , check for avtar
   // upload them to cloudinary
   // create user object
   // create entry in db
   // remove password and refresh token field from response
   // check for user creation 
   // return response

const {fullname, email, username, password }=req.body
console.log(fullname)
if(
    [fullname, email, password, username].some((field)=>
    field?.trim==="")
){
    throw new ApiError(400, "All fields are required")
}
const existedUser = User.findOne({
    $or: [{username}, {email}]
})
if(existedUser){
    throw new ApiError(409, "user with same username or email exist")
}

const avtarLocalPath = req.files?.avtar[0]?.path
const coverImageLocalPath = req.files?.coverImage[0]?.path

if(!avtarLocalPath){
    throw new ApiError(400, "Avtar not find")
}

const avtar = await uploadOnCloudinary(avtarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if(!avtar){
    throw new ApiError(400, "Avtar not find")
}
const user = await User.create({
    fullname,
    avtar: avtar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
})
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)
if(!createdUser){
    throw new ApiError(500, "something went wrong while creating the user")
}
return res.status(201).json(
    new ApiResponse(200, "user created successfully")
)
})

export {registerUser}
