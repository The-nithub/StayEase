if(process.env.NODE_ENV!="production")
{
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");//forms cannot do PATCH OR DELETE methods so we use this package
const ejsMate = require("ejs-mate");// for the ejs pages or templates
const ErrorExpress = require("./utils/ErrorExpress");
const session = require("express-session");
const Mongostore = require("connect-mongo");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");
const multer = require("multer"); // we use this to parse multipart i.e file data to the backend
const {storage} = require("./cloudConfig.js");
const upload = multer({storage});// we are storing the photos in the cloudinary storage we imported from the cloudconfig.js

// const MONGO_URL = "mongodb+srv://MernUser:sainitvin0455@mernweb.azivc.mongodb.net/?retryWrites=true&w=majority&appName=MernWeb";

const dburl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = Mongostore.create({//this is to store the session data on the mongodb
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",(err)=>{
  console.log("error in session store",err);
})

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());// this is to save users data in the session
passport.deserializeUser(User.deserializeUser());// this is to unsave or remove the users data in database

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.CurUser = req.user;
  next();
})

// app.get("/demouser",async (req,res)=>{
//   const fakeUser = new User({
//     email:"nithin@gmail.com",
//     username:"nayak"
//   });

//   await User.register(fakeUser,"mypassword");
//   res.send(fakeUser);
// })


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.use((req,res,next)=>{
   next(new ErrorExpress(404,"Page Not Found!!"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500,message="Some random Error"} = err;
  res.status(statusCode).render("error.ejs",{err});
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});