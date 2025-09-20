const express = require("express");
const Router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

Router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

Router.route("/login")
    .get(userController.renderloginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

Router.get("/logout",userController.logout);

module.exports = Router;
