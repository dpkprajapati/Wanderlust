const Listing = require("../models/listing")


module.exports.index= async (req,res)=>{
    const allListings= await Listing.find({}); 
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNew= (req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListing= async (req,res)=>{
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
}

module.exports.createListing = async (req,res)=>{
     if (!req.body){
        throw new expressError(400,"enter required field")
    }
    console.log(req.body)
    let newListing= new Listing(req.body)
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","new listing created")
    res.redirect("/listings");
}

module.exports.editFormRender = async (req,res)=>{
    let {id}= req.params;
    let list= await Listing.findById(id);
    res.render("listings/edit.ejs", {list});
}

module.exports.updateListing= async (req,res)=>{
    let {id}= req.params; 
    console.log(req.body)
    await Listing.findByIdAndUpdate(id, {...req.body})
    req.flash("success","updated successfully");
    res.redirect(`/listings/${id}`); // FIXED: removed underscore
}

module.exports.destroyListing= async (req,res,next)=>{
    let { id }= req.params;
    console.log(id)
    const deletelist= await Listing.findByIdAndDelete(id);
    console.log("deleted listing", deletelist);
    req.flash("success","listing deleted successfully")
   res.redirect("/listings");
}