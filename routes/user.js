const express = require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport=require("passport");
const{isLoggedIn, saveRedirectUrl}=require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
});

router.post("/signup", wrapasync(async (req, res, next) => {
    try {

        const { username, email, password } = req.body;

        const newu = new User({
            email,
            username
        });

        const regUser = await User.register(newu, password);

        req.login(regUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "New User registered Successfully!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("delete", e.message);
        res.redirect("/signup");
    }
}));
router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
});

router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Wrong Password !",
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    if(res.locals.redirectUrl==undefined){
        return res.redirect("/listings");
    }
    res.redirect(res.locals.redirectUrl);
  }
);

router.get("/logout",isLoggedIn,async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","LOGOUT SUCCESSFULL !");
        res.redirect("/listings");
    });
});

module.exports=router;