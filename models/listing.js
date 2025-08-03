const mongoose = require("mongoose");
const Review =require("./reviewing.js")



const  Schema = mongoose.Schema;
const listingSchema=new Schema({
    title: {
        type:String
    },
    description: {
        type:String
    },
    image:{
        type:String,
        default:"https://wallpaperaccess.com/full/11093098.jpg", //this used when image attribute is not set
        set:(v)=>v===""?"https://wallpaperaccess.com/full/11093098.jpg":v,   //this used when image attribute is set to empty string
    },
    price: {
        type:Number,
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    review:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }]
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } });
    }
});


module.exports= mongoose.model("Listing", listingSchema);