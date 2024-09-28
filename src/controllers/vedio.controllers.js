import mongoose, {isValidObjectId} from "mongoose"
import User from "../models/user_model.js"
import {Vedio} from "../models/vedio.model.js"

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken'
import { vedio, vedio } from "../models/vedio_model.js";


const getAllvedios =  async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all vedios based on query, sort, pagination
}

const publishAvedio =  async (req, res) => {
    const { title, description} = req.body
    // TODO: get vedio, upload to cloudinary, create vedio
    const VedioPath=req.files ?.vedio[0]?.path;
        const tumbnailPath=req.files ?.tumbnil[0]?.path;

      if(!VedioPath)
    return res.status(400).json({msg:"vedio file is required"})

 const vedioUrl= await uploadOnCloudinary(VedioPath);
 if(tumbnailPath){
    const tumbnailUrl= await uploadOnCloudinary(tumbnailPath);
 }
 
 const vedio=await Vedio.create({
    vedioFile:vedioUrl.url,
    tumbnil:tumbnailUrl?.url || null,
    title,
    description,
    owner:req.user._id,

 });
 vedio.save();

}

const getvedioById =  async (req, res) => {
    const { vedioId } = req.params
    //TODO: get vedio by id
    const vedio=Vedio.findById(vedioId);
    if(!vedio)
        return res.status(400).json({msg:"vedio not found"})
    return  res.status(200).json(vedio,{msg:"vedio found sucessfully"});

}

const updatevedio =  async (req, res) => {
    const { vedioId } = req.params
    //TODO: update vedio details like title, description, thumbnail
const { title, description} = req.body
        const tumbnailPath=req.files ?.tumbnil[0]?.path;

 if(tumbnailPath){
    const tumbnailUrl= await uploadOnCloudinary(tumbnailPath);
 }
  const vedio = await Vedio.findByIdAndUpdate(
        vedioId,
        {
            $set: {
                title,
                description,
                tumbnil:tumbnailUrl.url,
            }
        },
        {new: true}
        
    )

       return res.status(200).json({msg:"acount details updated sucessfully"});
}

const deletevedio =  async (req, res) => {
    const { vedioId } = req.params
    //TODO: delete vedio
    const vedio=await Vedio.findByIdandDelete(vedioId);
    if(!vedio)
        return res.status(200).json({msg:"vedio deleted sucessfully"})

}

// const togglePublishStatus =  async (req, res) => {
//     const { vedioId } = req.params
// }

export {
    getAllvedios,
    publishAvedio,
    getvedioById,
    updatevedio,
    deletevedio,
    togglePublishStatus
}
