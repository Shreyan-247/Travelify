const mongoose = require('mongoose');
const review = require("./reviews.js");
const User=require("./user.js");
const { ref } = require('joi');
const listingSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v)=>
            v===""
            ?"https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            :v,
    },
    price:{
        type:Number,
        min:0,
    },
    location:String,
    country:String,
    reviews:[{
        type : mongoose.Schema.Types.ObjectId,
        ref:review,
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}})
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;