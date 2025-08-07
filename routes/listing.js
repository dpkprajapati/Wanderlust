const express= require("express");
const ejs = require("ejs");
const Listing = require("../models/listing");
const wrapAsync= require("../utilis/wrapAsync.js")
const expressError= require("../utilis/expressError.js")
const {listingSchema}=require("../schema.js");
const router = express.Router()
const {isLoggedIn}= require("../middleware.js");
const {isOwner}= require("../middleware.js");



// index route
router.get("/", wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({}); 
    res.render("listings/index.ejs", {allListings});
 }))

// new listings route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")
})


//  show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}= req.params;
   const showlist= await Listing.findById(id)
   .populate({
    path:"review",
    populate:{
        path:"author"
    }
   })
   .populate("owner");
   
   if(!showlist){
    req.flash("error", "listing does not exist")
    res.redirect("/listings")
   }
    console.log(showlist)
    res.render("listings/show.ejs", {showlist})
}))

// new listing added
router.post("/",isLoggedIn, wrapAsync(async (req,res)=>{
     if (!req.body){
        throw new expressError(400,"enter required field")
    }
    console.log(req.body)
    let newListing= new Listing(req.body)
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","new listing created")
    res.redirect("/listings");
}))


// update route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let list= await Listing.findById(id);
    res.render("listings/edit.ejs", {list});
}))


// update submited
router.put("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req,res)=>{
    let {id}= req.params; 
    console.log(req.body)
    await Listing.findByIdAndUpdate(id, {...req.body})
    req.flash("success","updated successfully");
    res.redirect(`/listings/${id}`); // FIXED: removed underscore
}))


// delete listing
router.delete("/:id",isLoggedIn,
    isOwner,
    wrapAsync(async (req,res,next)=>{
    let { id }= req.params;
    console.log(id)
    const deletelist= await Listing.findByIdAndDelete(id);
    console.log("deleted listing", deletelist);
    req.flash("success","listing deleted successfully")
   res.redirect("/listings");
}))

module.exports=router