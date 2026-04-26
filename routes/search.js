const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const wrapAsync = require("../utils/wrapasync.js");

const listings = require("../models/listings.js");

router.post("/", wrapAsync(async (req, res) => {
    const { search } = req.body;

    if (!search) {
        return res.redirect("/listings");
    }

    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const results = await listings.find({ 
        location: { $regex: safeSearch, $options: "i" } 
    });
    if(results.length==0) {
        req.flash("delete","Sorry, We Don't have any stay for the location!");
        return res.redirect("/listings");
    }
    res.render("listings/search.ejs", { results, search });
}));




module.exports = router;