const User= require("../models/user.js")

module.exports.signupFormRender = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup = async (req,res)=>{
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
}

module.exports.loginFormRender = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async(req,res)=>{
        req.flash("success", "Welcome back!")
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","successfully logout")
        res.redirect("/listings")
    })
}