import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"



const toggleSubscription =async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const userid=req.user?._Id;

 const subscription=await Subscription.create({
    subscriber:userid,
    channel:channelId

 });
 if(!subscription)
    return res.status(500).json({msg:"internal server error"});
subscription.save();
return res.status(200).json({msg:"subscribed sucessfully"});
}

// controller to return subscriber list of a channel
const getUserChannelSubscribers = async(req, res) => {
    const {channelId} = req.params;
    const Allsubscribers=await Subscription.Aggregate[{
        $match:{
            channel:channelId,
            
        }
    },
    {
        $lookup:{
            from:"User",
            localField:"subscriber",
            foreignfield:"_id",
            as:"subscribers"
        }
    },
    {
      $addfields:{
        subscribers:{
            $size:"$subscribers"
        }
      }
    }
]
}

// controller to return channel list to which user has subscribed
const getSubscribedChannels = (req, res) => {
    const { subscribeId } = req.params;
    const getchannels=async (req,res)=>{
        allchannels=await subscription.find({subscriber:subscribeId});
    }
}

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}