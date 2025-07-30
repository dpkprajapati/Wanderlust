const express=  require("express")
const router=express.Router()


//  show route
 router.get("/",(req,res)=>{
    res.send("get for show posts")
 })

//  post user
 router.post("/:id",(req,res)=>{
    res.send("post of user")
 })
 
 module.exports=router