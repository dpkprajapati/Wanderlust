const express= require("express");
const ejs = require("ejs");
const Listing = require("../models/listing");
const wrapAsync= require("../utilis/wrapAsync.js")
const expressError= require("../utilis/expressError.js")
const {listingSchema}=require("../schema.js");
const router = express.Router()
const {isLoggedIn}= require("../middleware.js")

// index route
router.get("/", wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({}); 
    res.render("listings/index.ejs", {allListings});
 }))

// FIXED: new route BEFORE :id route (route order matters!)
// new listings route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")
})

// FIXED: Changed from "_:id" to ":id"
//  show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}= req.params;
   const showlist= await Listing.findById(id).populate("review");
//    if(!showlist){
//     req.flash("error", "listing does not exist")
//     res.redirect("/listings")
//    }
    res.render("listings/show.ejs", {showlist})
}))

// new listing added
router.post("/", wrapAsync(async (req,res)=>{
     if (!req.body){
        throw new expressError(400,"enter required field")
    }
    let newListing= new Listing(req.body)
    await newListing.save();
    req.flash("success","new listing created")
    res.redirect("/listings");
}))

// FIXED: Changed from "_:id" to ":id"
// update route
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let list= await Listing.findById(id);
    res.render("listings/edit.ejs", {list});
}))

// FIXED: Changed from "_:id" to ":id" and redirect URL
// update submited
router.put("/:id", wrapAsync(async (req,res)=>{
    let {id}= req.params; 
    console.log(req.body)
    await Listing.findByIdAndUpdate(id, {...req.body})
    req.flash("success","updated successfully");
    res.redirect(`/listings/${id}`); // FIXED: removed underscore
}))


// delete listing
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res,next)=>{
    let { id }= req.params;
    console.log(id)
    const deletelist= await Listing.findByIdAndDelete(id);
    console.log("deleted listing", deletelist);
    req.flash("success","listing deleted successfully")
   res.redirect("/listings");
}))

module.exports=router