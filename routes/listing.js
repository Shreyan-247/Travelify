const express = require("express");
const router=express.Router();
const ExpressError=require("../utils/expresserror.js");
const asyncWrap = require("../utils/wrapasync.js");
const {listingSchema}=require("../schema.js")
const Listing = require("../models/listings.js");
const{isLoggedIn,validateListing,isOwner}=require("../middleware.js");

router.get("/",asyncWrap(async(req,res)=>{
    let alllist=await Listing.find({});
    res.render("./listings/index.ejs",{alllist});
}));
router.get("/new",isLoggedIn,(req,res)=>{
    return res.render("./listings/new.ejs");
});
router.get("/:id",asyncWrap(async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.find({_id:id}).populate({
        path:"reviews",populate:{
            path:"author",
        }
    }).populate("owner");
    if(list.length==0){
        req.flash("delete","Cannot find Listing !");
        return res.redirect("/listings");
    }
    else{
        res.render("./listings/show.ejs",{list});
    }
}));
router.post("/",validateListing,asyncWrap(async(req,res)=>{
    let {title,description,image,price,location,country}=req.body;
    let newlist= new Listing({
        title:title,
        description:description,
        price:price,
        image:image,
        location:location,
        country:country,
        owner:req.user._id
    });
    await newlist.save();
    req.flash("success","New Listing Added Successfully!");
    res.redirect("/listings");
}));

router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.find({_id:id});
    if(list.length==0){
        req.flash("delete","Cannot find Listing !");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{list});
}));
router.put("/:id",isLoggedIn,isOwner,validateListing,asyncWrap(async(req,res)=>{
    let {title,description,image,price,location,country}=req.body;
    let {id}=req.params;
    let newlist= {
        title:title,
        description:description,
        price:price,
        image:image,
        location:location,
        country:country
    };
    await Listing.updateOne({_id:id},newlist);
    req.flash("success","Listing Information Updated Successfully!");
    res.redirect(`/listings/${id}`);
}));
router.delete("/:id",isLoggedIn,isOwner,asyncWrap(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("delete","One Listing Deleted!!");
    res.redirect(`/listings`);
}));


module.exports=router;