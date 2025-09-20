const User = require("../models/user");



module.exports.renderSignupForm = (req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.signup = async (req,res)=>{
    try{
      let {username,email,password} = req.body;
    const newUser = User({username,email});
    await User.register(newUser,password);
    console.log(newUser);
    req.login(newUser,(err)=>{
       if(err)
       {
        return next(err);
       }
        req.flash("success","welcome to StayEase");
        res.redirect("/listings");  
    })
    }catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderloginForm = (req,res)=>{
    res.render("user/login.ejs");
};

module.exports.login = async (req,res)=>{
    req.flash("success","welcome back to StayEase");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }

        req.flash("success","you logged out!");
        res.redirect("/listings");
    });
};


