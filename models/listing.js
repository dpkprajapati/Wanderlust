const mongoose = require("mongoose");

const  Schema = mongoose.Schema;
const listingSchems=new Schema({
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
    }
})

module.exports= mongoose.model("Listing", listingSchems);