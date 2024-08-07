import express from 'express';
const app=express();
import cookieParser from 'cookie-parser'
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routes/user_route.js'
app.use("/users",userRouter)
export {app}