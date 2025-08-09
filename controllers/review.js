const Review = require("../models/reviewing.js")
const Listing = require("../models/listing.js")


module.exports.createReview = async (req,res)=>{
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
}

module.exports.destroyReview = async (req,res)=>{
    let {id,reviewId}= req.params;
    console.log("Listing ID:", id);
    await Listing.findByIdAndUpdate(id, {$pull: {review :reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","review deleted")
    res.redirect(`/listings/${id}`)  
}  