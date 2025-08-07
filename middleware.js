const Listing = require("./models/listing.js");
const {reviewSchema} = require("./schema.js")
const Review=require("./models/reviewing.js")

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        console.log(req.session.redirectUrl)
        req.flash("error", "Please login first ")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}


module.exports.isOwner=async (req,res,next)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    
    // Check if listing exists
    if(!listing){
        req.flash("error", "Listing not found")
        return res.redirect("/listings");
    }
    
    // Check if user is logged in
    if(!res.locals.currUser){
        req.flash("error", "Please login first")
        return res.redirect("/login");
    }
    
    // Check ownership
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner of this listing")
        return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports.validateReview=(req,res,next)=>{
    console.log("Incoming Review Data:", req.body);
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}= req.params; 
    let review= await Review.findById(reviewId);
    
    // Check if review exists
    if(!review){
        req.flash("error", "Review not found")
        return res.redirect(`/listings/${id}`);
    }
    
    // Check if user is logged in
    if(!res.locals.currUser){
        req.flash("error", "Please login first")
        return res.redirect("/login");
    }
    
    // Check if user is the author
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the author of this review")
        return res.redirect(`/listings/${id}`);
    }
    next()
}