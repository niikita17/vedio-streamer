
import jwt from "jsonwebtoken"
import { User } from "../models/user_model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized request"})
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            return res.status(401).json({ msg: "Invaid access toekn"})
        }
    
        req.user = user;
        next()
    } catch (error) {
        return res.status(401).json({ msg: error.message || "Invaid access toekn"})
    }
    
})