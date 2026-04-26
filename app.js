const express = require("express");
const app=express();
const port=8080;
const path=require("path");
const mongoose = require('mongoose');
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
const listingsRoute=require("./routes/listing.js");
const reviewsRoute=require("./routes/review.js");
const usersRoute=require("./routes/user.js");
const searchRoute=require("./routes/search.js");
const sessions=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.use(sessions({
  secret: 'mysupersecretcode',
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+24*14*60*60*100,
    maxAge:24*14*60*60*100,
    httpOnly:true
  }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successmsg=req.flash("success");
    res.locals.errormsg= req.flash("error");
    res.locals.deletemsg=req.flash("delete");
    res.locals.currUser=req.user;
    res.locals.currentPath = req.path;
    next();
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));

main().then(()=>{console.log("connection successfull");})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const newLocal = "ejs-mate";
const ejsMate=require(newLocal);
app.engine("ejs",ejsMate);

app.listen(port,()=> {
    console.log(`LISTENING TO PORT : 8080`);
});

const ExpressError=require("./utils/expresserror.js");
const wrapasync = require("./utils/wrapasync.js");
const { copyFile } = require("fs");

app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/search",searchRoute);
app.use("/",usersRoute);

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found !"));
})
app.use((err,req,res,next)=>{
    let {status=500 , message="Something went Wrong !" }=err;
    res.status(status).render("./listings/error.ejs",{ message });
})
