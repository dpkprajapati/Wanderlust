const express= require("express");
const ejs = require("ejs");
const Listing = require("../models/listing");
const wrapAsync= require("../utilis/wrapAsync.js")
const expressError= require("../utilis/expressError.js")
const {listingSchema}=require("../schema.js");
const router = express.Router()
const {validateListing,isLoggedIn}= require("../middleware.js");
const {isOwner}= require("../middleware.js");
const listingController = require("../controllers/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
// const upload = multer({storage})

 

// Configure multer with file size limit and error handling
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});



// index route
router.get("/", wrapAsync(listingController.index))


// new listings route
router.get("/new",isLoggedIn,listingController.renderNew)


//  show route
router.get("/:id",wrapAsync(listingController.showListing))

//create new listing
router.post("/",
    isLoggedIn, 
    upload.single('image'),
    // validateListing,
    wrapAsync(listingController.createListing))

// update route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editFormRender))


// update submited
router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single('image'),
    validateListing,
    wrapAsync(listingController.updateListing))


// delete listing
router.delete("/:id",isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing))

module.exports=router