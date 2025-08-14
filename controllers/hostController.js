const Home = require("../models/home");
const fs = require('fs')

exports.getAddHome = (req, res, next) => {
  const homeid=req.params.homeid
  res.render("host/edit-homes", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing:false,
    isLoggedIn:req.isLoggedIn,
    user:req.session.user
    

  });
};
exports.getEditHomes = (req, res, next) => {
  const homeid=req.params.homeid
  const editing =req.query.editing==='true'
  // find exact home by id
  Home.findById(homeid).then(home=>{
    if(!home)
    {
      console.log("Home not found for editing")
      return res.redirect("/host/host-home-list")
    }
    res.render("host/edit-homes", {
      home:home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing:editing,
      isLoggedIn:req.isLoggedIn,
      user:req.session.user

  })
  });
};

exports.getHostHomes = (req, res, next) => {
  // get all homes
  Home.find().then(registeredHomes =>{
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn:req.isLoggedIn,
      user:req.session.user

    })
  }
  );
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  console.log("My home:", houseName, price, location, rating, description)
  const photo = req.file.path
  console.log("The photo path is:",photo)
  if(!req.file)
  {
    return res.status(422).send("No image is provided")
  }
  //bana banaya object expect krta ha home 
  const home = new Home({houseName, price, location, rating, photo, description}

  );

  home.save()
    .then(result => {
      console.log('✅ Home saved successfully:');
      res.redirect("/host/host-home-list");
    })
    .catch(err => {
      console.error('❌ Failed to save home:', err);
      res.status(500).send('Internal Server Error');
    });
};
exports.postEditHome = (req, res, next) => {
  const { houseName, price, location, rating, description,homeId, } = req.body;
  Home.findById(homeId).then((home)=>{
    home.houseName=houseName;
    home.price=price;
    home.location=location;
    home.rating=rating;
    home.description=description;
    if (req.file) {
      
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          } else {
            console.log("Old image deleted successfully.");
          }
        });
  
      home.photo = req.file.path;
    }
  home.save().then(result=>{
    res.redirect("/host/host-home-list");
  }).catch(err => {
    res.status(500).send('Internal Server Error');
  });
}).catch(err=>{
})
};

// exports.postDeleteHome = (req, res) => {
//   const homeid = req.params.homeId;
//   Home.findByIdAndDelete(homeid).then(result => {
//     res.redirect("/host/host-home-list");
//   }).catch(error => {
//     res.redirect("/host/host-home-list");
//   });
// };
exports.postDeleteHome = (req, res) => {
  const homeId = req.params.homeId;

  Home.findById(homeId)
    .then(home => {
      if (!home) {
        return res.redirect("/host/host-home-list");
      }

      // Delete the image file if it exists
      if (home.photo) {
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.error("Error deleting home image:", err);
          } else {
            console.log("Home image deleted successfully.");
          }
        });
      }

      // Now delete the home document
      return Home.findByIdAndDelete(homeId);
    })
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch(err => {
      console.error("❌ Error deleting home:", err);
      res.redirect("/host/host-home-list");
    });
};