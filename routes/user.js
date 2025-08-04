const express= require("express");
const router= express.Router();
const User= require("../models/user.js")
const wrapAsync= require("../utilis/wrapAsync.js")
const passport = require("passport")
const {saveRedirectUrl}= require("../middleware.js")


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
            req.login(registerUSer,(err)=>{
                if(err){
                    return next(err)
                }
                req.flash("success","user registered successfully")
                res.redirect("/listings")
            })
            
    } catch (e) {
        console.log(e.message)
        req.flash("error", e.message)
        res.redirect("/signup");
    } 
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true
    }),
     async(req,res)=>{
        req.flash("success", "Welcome back!")
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
})

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","successfully logout")
        res.redirect("/listings")
    })
})

module.exports= router;