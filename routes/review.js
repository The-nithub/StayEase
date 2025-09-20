const express = require("express");
const router = express.Router({mergeParams:true});

const Listing = require("../models/listing.js");//requiring the listing model
const wrapAsync = require("../utils/wrapAsync.js");
const ErrorExpress = require("../utils/ErrorExpress");
const {reviewSchema} = require("../schema.js");//these are the schema validations for creating post and reviews using joy
const Review = require("../models/reviews.js");// requiring the review model
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");




//reviews route
router.post("/",validateReview,isLoggedIn, wrapAsync (reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;
