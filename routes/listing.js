const express= require("express");
const ejs = require("ejs");
const Listing = require("../models/listing");
const wrapAsync= require("../utilis/wrapAsync.js")
const expressError= require("../utilis/expressError.js")
const {listingSchema}=require("../schema.js");
const router = express.Router()
const {isLoggedIn}= require("../middleware.js");
const {isOwner}= require("../middleware.js");
const listingController = require("../controllers/listing.js")



// index route
router.get("/", wrapAsync(listingController.index))


// new listings route
router.get("/new",isLoggedIn,listingController.renderNew)


//  show route
router.get("/:id",wrapAsync(listingController.showListing))

// new listing added
router.post("/",isLoggedIn, wrapAsync(listingController.createListing))


// update route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editFormRender))


// update submited
router.put("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.updateListing))


// delete listing
router.delete("/:id",isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing))

module.exports=router