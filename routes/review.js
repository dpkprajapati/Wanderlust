const express= require("express");
const wrapAsync= require("../utilis/wrapAsync.js")
const expressError= require("../utilis/expressError.js")
const {reviewSchema}=require("../schema.js")
const Review=require("../models/reviewing.js")
const Listing = require("../models/listing");
const router = express.Router({mergeParams:true}) //to use element from parent route in callbacks


// validation for server side 
const validateReview = (req, res, next) => {
  console.log("Incoming Review Data:", req.body);
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};
//review route              we cant access id without setting {mergeParams:true} ....this is used to access parent element in callbacks
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let {id}= req.params
    let showlist =await Listing.findById(req.params.id)
    let newReview= new Review (req.body)
    showlist.review.push(newReview)
    await newReview.save()
    await showlist.save()
    console.log("new review saved")
    req.flash("success","new review added")
    res.redirect(`/listings/${id}`)
}))


// delete review
router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId}= req.params;
    console.log("Listing ID:", id);
    await Listing.findByIdAndUpdate(id, {$pull: {review :reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","review deleted")
    res.redirect(`/listings/${id}`)
}))

module.exports=router