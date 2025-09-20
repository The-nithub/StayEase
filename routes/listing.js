const express = require ("express");
const router = express.Router();

const Listing = require("../models/listing.js");//requiring the listing model
const wrapAsync = require("../utils/wrapAsync.js");
const ErrorExpress = require("../utils/ErrorExpress");
const {listingSchema,reviewSchema} = require("../schema.js");//these are the schema validations for creating post and reviews using joy

const {isLoggedIn,saveRedirectUrl,isOwner,validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});// we are storing the photos in the cloudinary storage we imported from the cloudconfig.js

router.route("/")
    //index route
    .get(wrapAsync(listingController.index))
    //create route
    .post(validateListing,isLoggedIn,upload.single("listing[image]"), wrapAsync( listingController.createListing));
    

router.route("/new")  //--> this line should be above the /:id beacuse the router.route will interpret as an id and it will search for that id which is not valid
        //new route
        .get(isLoggedIn, listingController.renderNewForm);
router.route("/:id")
    //show route
    .get(wrapAsync( listingController.showListings))
    //update route
    .put(validateListing,isLoggedIn,isOwner, upload.single("listing[image]"),wrapAsync( listingController.updateListing))
    //delete route
    .delete(isLoggedIn,isOwner,wrapAsync( listingController.destroyListing));

    //edit route
router.route("/:id/edit")
    .get(isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.renderEditForm));


module.exports = router;

