if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
console.log("MAP_KEY:", process.env.MAP_KEY ? "Present" : "Missing");

 
const cors = require('cors');
const express= require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path= require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError= require("./utilis/expressError.js")
const listings = require("./routes/listing.js")
const reviews= require("./routes/review.js")
const session  =  require("express-session")
const mongoStore= require("connect-mongo")
const flash = require("connect-flash")
const passport =require("passport")
const LocalStrategy = require("passport-local");
const User =  require("./models/user.js")
const userRouter= require("./routes/user.js")


const dbUrl= process.env.ATLASDB_URL        //this is for atlas db :: a cloud databse service.....now our project use cloud database

// connnectiion to mongodb
async function main(){
    await mongoose.connect(dbUrl) 
}
main().then((res)=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error("Error connecting to MongoDB", err)});

    
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs", ejsMate);
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


const store = mongoStore.create({
    mongoUrl: dbUrl,
    crypto: {                //this is used to encrypt the session data
    secret: 'process.env.SECRET',
  },
    touchAfter: 24 * 3600 // time period in seconds(currently it is 24 hours)   it is basically used to store the session of a user so that user dont have to login again and again even after server restarts
})

store.on("error",()=>{
    console.log("session store error", error   )
})

// FIXED: Session configuration for proper cookie handling
const sessionOptions = {
    store,
    secret:"process.env.SECRET",
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true,
        sameSite: 'lax' // Required for proper cookie handling
    }
}


app.use(session(sessionOptions))
app.use(flash())

// FIXED: Passport initialization before flash locals
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// res.locals can be used anywhere in the project
app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser= req.user;       //this checks the user credentials if he is logged in or not
     res.locals.mapToken = process.env.MAP_KEY;  // Add this line
    next()
})

// app.get("/",  (req,res)=>{
//     res.send("Welcome to the home page")
// })

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// defined routes are parent routes and to access some element from parent routes then set Route({mergeParams:true}) in he other routers to be exported and imported in app.js
app.use("/listings", listings)
app.use("/listings/:id/reviews",reviews)
app.use("/",userRouter) 





app.listen("8080", ()=>{
    console.log("Server is running on port 8080");
})



// middleware when worng page
app.use((req, res, next) => {
  console.log("404 for:", req.originalUrl);
  next(new expressError(404, "page not found"));
});


// global middleware
app.use((error, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).render("error.ejs", { error });
  console.log(error)
});