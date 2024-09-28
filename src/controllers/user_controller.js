import {User} from "../models/user_model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken'



const registerUser=async (req,res)=>{
const { fullname,username, email, password}=req.body;
  if(!fullname|| !username || !email || !password)
    return res.status(400).json({msg:" All fields are required"})
  
  const existeduser=await User.findOne({$or:[{username},{email}]})
  if(existeduser){
    return res.status(409).json({msg:"user already existed"});
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
 const user=await User.create({
    fullname,
    email,
    username,
    password,
    avatar:avatar.url,

 });
 user.save();

 return res.status(201).json({msg:"user created sucessfully"});
}


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        return res.status(500).json({mag:"Something went wrong while generating referesh and access token"})
    }
}
const loginUser = async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        return res.status(400).json({msg: "username or email is required"})
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        return res.status(404).json({msg: "user does not exist"})
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
        return res.status(400).json({msg: "Invalid credentials"})
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({msg:"User logged In Successfully"})

}
const logoutUser = async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({msg: "User logged Out"})
}

const refreshAccessToken=async(req,res)=>{
    const incomingtoken=res.cookies.refreshToken ||res.body.refreshToken;
    if(!incomingtoken)
        return res.status(401).json({msg:"unauthorized request"});  
    const decodedToken=jwt.verify(incomingtoken,process.env.refreshTokenSecret);
      const user=await User.findById(decodedToken?._id);
    if(!user){
        return res.status(401).json({msg:"Invalide refresh token"})
    }
    if(incomingtoken !== user?.refreshToken)
    return res.status(401).json({msg:"Invalide refresh token"})
          const options = {
        httpOnly: true,
        secure: true
    }  
    const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", {refreshToken:newRefreshToken}, options)
    .json({msg:"User logged In Successfully"})

}


const changeCurrentPassword = async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})
    return res.status(200).json({msg:"password changed sucessfully"});

}


const getCurrentUser = async(req, res) => {
       return res.status(200).json({msg:"user fetched sucessfully"});

}

const updateAccountDetails = async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
           return res.status(400).json({msg:"all fields are required"});

    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

       return res.status(200).json({msg:"acount details updated sucessfully"});

};

const updateUserAvatar =async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
    return res.status(400).json({msg:"avatar file is missing"});
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
           return res.status(400).json({msg:"error during uploading file"});

        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

       return res.status(200).json({msg:"avatr image updated sucessfully"});

}

const updateUserCoverImage =async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
           return res.status(400).json({msg:"cover image is missing"});

    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
            return res.status(400).json({msg:"error while uploading cover image "});

        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
     user,{msg: "Cover image updated successfully"}
    )
}


const getUserChannelProfile =async(req, res) => {
    const {username} = req.params

    if (!username?.trim()) {
            return res.status(400).json({msg:"user name is missing"});

    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel?.length) {
           return res.status(404).json({msg:"channel doesn't exist"});

    }

    return res
    .status(200)
    .json(
       channel[0], {msg:"User channel fetched successfully"})
    
}

const getWatchHistory = async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        
            user[0].watchHistory,
          { msg: "Watch history fetched successfully"}
        )
    
}


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}