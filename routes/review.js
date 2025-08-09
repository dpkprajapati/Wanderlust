const express= require("express");
const wrapAsync= require("../utilis/wrapAsync.js")
const expressError= require("../utilis/expressError.js")
const Review=require("../models/reviewing.js")
const Listing = require("../models/listing");
const router = express.Router({mergeParams:true}) //to use element from parent route in callbacks
const {validateReview,isLoggedIn,isReviewAuthor}= require("../middleware.js")
const reviewController = require("../controllers/review.js")


//review route we cant access id without setting {mergeParams:true} ....this is used to access parent element in callbacks
router.post("/",isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview))


// delete review
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview))

module.exports=router