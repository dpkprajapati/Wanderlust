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
        url:String,
        filename: String,
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
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category: {
        type: String,
        enum: [
            "Trending", 
            "Rooms", 
            "Hills", 
            "Premium", 
            "Iconic cities", 
            "Arctic", 
            "Camping", 
            "Farms", 
            "Ships", 
            "Religious"
        ],
        required: true,
        default: "Rooms"
    },
    location: {
        type: String,
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // GeoJSON type must be Point
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number], // Array of numbers: [longitude, latitude]
            required: true,
            default: [0,0]
        }
    },
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } });
    }
});


module.exports= mongoose.model("Listing", listingSchema);