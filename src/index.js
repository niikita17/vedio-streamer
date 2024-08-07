import express from "express";
import connectDB from "./db/connectdb";
import dotenv from "dotenv";
import app from './app.js'
import userRouter from "./routes/user_route.js"
dotenv.conf({
  path: "./env",
});


app.use("/api/users");

connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`server is running at port ${process.env.PORT}`)
  })
  console.log("databse connected sucessfuly")
}).catch((error)=>{
  console.log(error);
})

