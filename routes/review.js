const express= require("express");
const wrapAsync= require("../utilis/wrapAsync.js")
const expressError= require("../utilis/expressError.js")
const Review=require("../models/reviewing.js")
const Listing = require("../models/listing");
const router = express.Router({mergeParams:true}) //to use element from parent route in callbacks
const {validateReview,isLoggedIn,isReviewAuthor}= require("../middleware.js")



//review route              we cant access id without setting {mergeParams:true} ....this is used to access parent element in callbacks
router.post("/",isLoggedIn,
  validateReview,
  wrapAsync(async (req,res)=>{
    let {id}= req.params
    let showlist =await Listing.findById(req.params.id)
    let newReview= new Review (req.body)
    newReview.author = req.user._id;
    console.log(newReview);
    showlist.review.push(newReview)
    await newReview.save()
    await showlist.save()
    console.log("new review saved")
    req.flash("success","new review added")
    res.redirect(`/listings/${id}`)
}))


// delete review
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req,res)=>{
    let {id,reviewId}= req.params;
    console.log("Listing ID:", id);
    await Listing.findByIdAndUpdate(id, {$pull: {review :reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","review deleted")
    res.redirect(`/listings/${id}`)
}))

module.exports=router