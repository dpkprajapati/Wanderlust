const Listing = require("../models/listing");
const maptilerClient = require('@maptiler/client');
maptilerClient.config.apiKey = process.env.MAP_KEY; 

module.exports.index = async (req, res) => {
    try {
        let filter = {};
        const { category } = req.query;
        const { search } = req.query;

        // If category is provided in query params, filter by it
        if (category && category !== "all") {
            filter.category = category;
        }

        if (search && search.trim() !== "") {
        // Search by title, location, or country (case-insensitive)
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } },

        ];
        }

        const allListings = await Listing.find(filter);

        // Get all categories for the filter buttons
        const categories = [
            "Trending", "Rooms", "Hills", "Premium", "Iconic cities", 
            "Arctic", "Camping", "Farms", "Ships", "Religious"
        ];

        res.render("listings/index.ejs", { 
            allListings, 
            categories, 
            selectedCategory: category || "all",
            search: search || ""
        });
    } catch (err) {
        req.flash("error", "Something went wrong while fetching listings");
        res.redirect("/");
    }
}

module.exports.renderNew = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const showlist = await Listing.findById(id)
        .populate({
            path: "review",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!showlist) {
        req.flash("error", "listing does not exist");
        res.redirect("/listings");
    }
    console.log(showlist);
    res.render("listings/show.ejs", { showlist, currUser: req.user, mapToken: process.env.MAP_KEY,coordinates: showlist.geometry.coordinates, locationName: showlist.location  });
}

module.exports.createListing = async (req, res) => {
   try{
     const { location } = req.body;
    const apiKey = process.env.MAP_KEY;
    const MapUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${apiKey}&limit=1`;

    const response = await fetch(MapUrl);
    const data = await response.json();

    let geometry = {
      type: 'Point',
      coordinates: [0, 0],
    };

    if (data.features && data.features.length > 0) {
      geometry.coordinates = data.features[0].geometry.coordinates; // [lng, lat]
    }
    console.log(req.body);
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
    let newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = geometry;
    console.log(newListing);
    await newListing.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");
   }
   catch(err){
        console.log(err);
        req.flash("error", "Failed to create listing. Please try again.");
        res.redirect("/listings/new");
    }
}

module.exports.editFormRender = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    let originalImageUrl= list.image.url;
    console.log(originalImageUrl)
    res.render("listings/edit.ejs", { list, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    const { location } = req.body;
    const apiKey = process.env.MAP_KEY;

    let geometry = {
      type: 'Point',
      coordinates: [0, 0],
    };

    if (location) {
      const response = await maptilerClient.geocoding.forward(location, {
        key: apiKey,
        limit: 1,
      });

      if (response.features && response.features.length > 0) {
        geometry.coordinates = response.features[0].geometry.coordinates;
      }
    }

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body, geometry }, { new: true });

   if (typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image={url,filename}
        console.log(req.file.url)
        await listing.save();
    }

    req.flash("success", "updated successfully");
    res.redirect(`/listings/${id}`);

  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update listing. Please try again.");
    res.redirect(`/listings/${id}/edit`);
  }
};


module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    console.log(id);
    const deletelist = await Listing.findByIdAndDelete(id);
    console.log("deleted listing", deletelist);
    req.flash("success", "listing deleted successfully");
    res.redirect("/listings");
}