const express= require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing");
const path= require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utilis/wrapAsync.js")
const expressError= require("./utilis/expressError.js")
const {listingSchema}=require("./schema.js")
const Review=require("./models/reviewing.js")
const {reviewSchema}=require("./schema.js")


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs", ejsMate);

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust") 
}
main().then((res)=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error("Error connecting to MongoDB", err)});



//this is the for server side validation (in hopscotch , postman etc.)when we write "comment " instead of "comment" becoz the space could also throw error
// this is extra bulletproofing
// app.use((req, res, next) => {
//   req.body = Object.entries(req.body).reduce((acc, [key, value]) => {
//     acc[key.trim()] = value;
//     return acc;
//   }, {});
//   next();
// });

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


app.get("/",  (req,res)=>{
    res.send("Welcome to the home page")
})

app.get("/listings", wrapAsync(async (req,res)=>{
    let allListings= await Listing.find({}); 
    res.render("listings/index.ejs", {allListings});
 }))

//  show route
app.get("/listings/_:id",wrapAsync(async (req,res)=>{
    let {id}= req.params;
   const showlist= await Listing.findById(id).populate("review");
    res.render("listings/show.ejs", {showlist})
}))

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

app.post("/listings", wrapAsync(async (req,res)=>{
     if (!req.body){
        throw new expressError(400,"enter required field")
    }
    //    let {title, description, image, price, location, country}= req.body;
    let newListing= new Listing(req.body)
    await newListing.save();
    res.redirect("/listings");
}))

app.delete("/listings/_:id",wrapAsync(async (req,res,next)=>{
    let { id }= req.params;
    console.log(id)
    const deletelist= await Listing.findByIdAndDelete(id);
    console.log("deleted listing", deletelist);
   res.redirect("/listings");
}))

app.get("/listings/_:id/edit",wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let list= await Listing.findById(id);
    res.render("listings/edit.ejs", {list});
}))

app.put("/listings/_:id", wrapAsync(async (req,res)=>{
    let {id}= req.params; 
    console.log(req.body)
    await Listing.findByIdAndUpdate(id, {...req.body});
    res.redirect(`/listings/_${id}`);
}))

//review route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
    let {id}= req.params
    let showlist =await Listing.findById(req.params.id)
    let newReview= new Review (req.body)
    showlist.review.push(newReview)
    await newReview.save()
    await showlist.save()
    console.log("new review saved")
    res.redirect(`/listings/_${id}`)
}))


// delete review
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId}= req.params;
    console.log("Listing ID:", id);
    await Listing.findByIdAndUpdate(id, {$pull: {review :reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/_${id}`)
}))


// middleware when worng page
app.use((req,res,next)=>{
    next(new expressError(404,"page not found"));
})

// global middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { err });
  console.log(err)
});


app.listen("8080", ()=>{
    console.log("Server is running on port 8080");
})