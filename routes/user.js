const express= require("express");
const router= express.Router();
const User= require("../models/user.js")
const wrapAsync= require("../utilis/wrapAsync.js")
const passport = require("passport")


router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async (req,res)=>{
    try{
        let {username,email,password}= req.body;
            console.log(req.body)
            let newUser = new User ({email,username})
            let registerUSer=await User.register(newUser, password);
            console.log(registerUSer)
            req.flash("success","user registered successfully")
            
            res.redirect("/listings")
    } catch (e) {
        console.log(e.message)
        req.flash("error", e.message)
        res.redirect("/signup");
    } 
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("success", "welcome to the site")
    res.redirect("/listings")
})
module.exports= router;