const express = require("express")
const router=express.Router()



//  show route
 router.get("/",(req,res)=>{
    res.send("get for show users")
 })


 router.post("/:id",(req,res)=>{
    res.send("post to user")
 })
 
 module.exports=router;