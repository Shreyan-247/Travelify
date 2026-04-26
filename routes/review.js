const express = require("express");
const router=express.Router({mergeParams:true});
const ExpressError=require("../utils/expresserror.js");
const asyncWrap = require("../utils/wrapasync.js");
const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");
const{validateReview,isLoggedIn, isReviewauthor, saveRedirectUrl}=require("../middleware.js");


router.post("/",validateReview,asyncWrap(async(req,res)=>{
    let {id}=req.params;
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=`/listings/${id}`;
        req.flash("error", "Please Login First");
        return res.redirect("/login");
    }
    let list=await Listing.findOne({_id:id});
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    await newreview.save();
    list.reviews.push(newreview);
    await list.save();
    req.flash("success","New Review Added Successfully!");
    res.redirect(`/listings/${id}`);
}))
router.delete(
  "/:reviewId",isLoggedIn,isReviewauthor,
  asyncWrap(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("delete","One Review Deleted!!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports=router;