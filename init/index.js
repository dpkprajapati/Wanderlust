const mongoose=require("mongoose");
const initData=  require("./data.js");
const Listing=require("../models/listing.js")

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust") 
}

main().then((res)=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error("Error connecting to MongoDB", err)
});


const initDb= async ()=>{
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
}

initDb();