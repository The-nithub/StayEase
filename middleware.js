const Listing = require("./models/listing");
const ErrorExpress = require("./utils/ErrorExpress.js");
const {listingSchema,reviewSchema} = require("./schema.js");//these are the schema validations for creating post and reviews using joy
const Review = require("./models/reviews.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to continue");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//middleware to check if the logged inperson is the owner or not

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.CurUser._id))
    {
        req.flash("error","You are not allowed to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//middleware to validate the post/new listing that is being added
module.exports.validateListing = (req,res,next) =>{// this function is to validate the listing schema we did it using joy in (schma.js)
  let {error} = listingSchema.validate(req.body);
  if(error)
  {
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ErrorExpress(400,errMsg);
  }else
  {
    next();
  }
}

//function to validate the review
module.exports.validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error)
  {
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ErrorExpress(400,errMsg);
  }else
  {
    next();
  }
}

//middleware to check if the logged inperson is the author of review or not

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.CurUser._id))
    {
        req.flash("error","You are not allowed to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    next();
}