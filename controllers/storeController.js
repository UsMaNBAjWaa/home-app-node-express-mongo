
const Home = require("../models/home");
const User = require("../models/User");
const { use } = require("../routes/authRouter");
const path = require('path')
const rootDir = require('../utils/pathUtil')


exports.getIndex = (req, res, next) => {
  console.log("Session body",req.session)
  Home.find().then(registeredHomes=>
  {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn:req.isLoggedIn,
      user:req.session.user

    })
  }
  );
};

exports.getHomes = (req, res, next) => {
  Home.find().then(registeredHomes =>
  {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn:req.isLoggedIn,
      user:req.session.user

    })
});
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn:req.isLoggedIn,
    user:req.session.user

  })
};

exports.getFavouriteList = async(req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourite');
      res.render("store/favourite-list", {
        favouritehome: user.favourite,
        pageTitle: "My Favourites",
        currentPage: "favourites",
        isLoggedIn:req.isLoggedIn,
        user:req.session.user

  })
};

exports.postFavouriteList = async (req, res, next) => {
  const homeid = req.body.id;
  const userId = req.session.user._id;

    const user = await User.findById(userId);

    if (!user.favourite.includes(homeid)) {
      user.favourite.push(homeid);
      await user.save();
    }
      return res.redirect("/favourites");
  };

   
exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeid = req.params.homeID;
  const userId = req.session.user._id;
  
  const user = await User.findById(userId);
  console.log("homeId:",homeid, "UserId:",user)

  if (user.favourite.includes(homeid)) {
    user.favourite = user.favourite.filter(fav=>fav!=homeid);
    await user.save();
  }
    return res.redirect("/favourites");
};

exports.getHomeDetails = (req, res, next) => {
  const homeid= req.params.homeId
  Home.findById(homeid).then(home=>{
    if(!home)
    {
      res.redirect("/homes");
    }
  else{

    res.render("store/home-detail", {
      home:home,
      pageTitle: "Home Details",
      currentPage: "Home",
      isLoggedIn:req.isLoggedIn,
      user:req.session.user

    })
  }
  })
  // res.send("Id of the house is "+ homeid)
}
 exports.getHomeRules=[(req,res,next)=>{
  if(!req.session.isLoggedIn)
  {
    return res.redirect("/login");
  }
  next();
 },
 (req,res,next)=>{
  const homeId = req.params.homeId;
  const rulesFileName = 'rules.pdf'
  const filePath= path.join(rootDir,'rules',rulesFileName) 
  console.log("Resolved path:", filePath);
  res.download(filePath,'Rules.pdf')
 }
];

