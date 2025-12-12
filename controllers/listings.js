const Listing = require("../models/listing");


module.exports.index = async (req, res) => {
  // const allListings = await Listing.find({});
  // res.render("listings/index.ejs", { allListings });

  try {
    const page = Math.max(1,parseInt(req.query.page) || 1);

    const items_per_page = 9;

    const skip = (page - 1)*items_per_page;

    const[totalItems , listings] = await Promise.all([
      Listing.countDocuments({}),
      Listing.find({})
      .skip(skip)
      .limit(items_per_page)
      .lean()
      .exec()
    ]);

    console.log("DEBUG:", {
  page,
  skip,
  items_per_page,
  totalItems,
  listingsReturned: listings.length
});


    const totalPages = Math.max(1,Math.ceil(totalItems/items_per_page));
    const currentPage = Math.min(page,totalPages);

    res.render("listings/index.ejs",{
      listings,
      currentPage,
      totalPages,
      itemsPerPage:items_per_page,
      totalItems
    });

  } catch (error) {
    console.log("this error is due to pagination",error);

    res.status(500).send("something went wrong near paginatoin index route");
  }
};

module.exports.renderNewForm = (req, res) => {

  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if(!listing)
  {
    req.flash("error","The Listing That You Are Looking For Might Be Deleted");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res,next) => {
  
  let url = req.file.path;
  let filename=req.file.filename;
  console.log(url,filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;//passportstores the info related to the user in the req.
    newListing.image={url,filename};

    await newListing.save();

    req.flash("success","new listing created");
   res.redirect("/listings");

  
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing)
  {
    req.flash("error","The Listing That You Are Looking For Might Be Deleted");
    return res.redirect("/listings");
  }

  let originalUrl = listing.image.url;
  originalUrl=originalUrl.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs", { listing ,originalUrl});
};

module.exports.updateListing = async (req, res) => {

  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file!=="undefined")
  {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = {url,filename};
    await listing.save();
  }
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted");
  res.redirect("/listings");
};