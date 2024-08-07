import mongoose, { Schema } from "mongoose";
const userSchema=new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    
    },
    
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    
    avatar:{
        type:String
    },
    
    coveImage:{
        type:String,
    },
    watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:'Video'
    }],
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String,
    }
},

    {
        timestamps:true
    }
)

userSchema.pre("save", async function (next){
    if(this.isModified("password")){
        this.password=bcrypt.hash(this.password,11)
    }else{
        next();
    }
    next();
})
userSchema.methods.isPasswordCorrect= async function 
(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAcessToken=async function(){
    jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRETE,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken=async function(){
    jwt.sign({
        _id:this._id,
        email:this.email,
        
    },
    process.env.REFRESH_TOKEN_SECRETE,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User=mongoose.model("User",userSchema)