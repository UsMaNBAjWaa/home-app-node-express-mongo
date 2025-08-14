// Core Module
const path = require('path');

// External Module
const express = require('express');
const multer  = require('multer')
const {mongoose}=require ('mongoose');
const session = require('express-session');
const MongodbStore=require('connect-mongodb-session')(session)
const DB_PATH="mongodb+srv://usmanbajwa:aabbcc1122@usmanbajwa.5f193i3.mongodb.net/homedata?retryWrites=true&w=majority&appName=usmanbajwa"

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const authRouter = require("./routes/authRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");

const app = express();
const store = new MongodbStore({
  uri:DB_PATH,
  collection:'sessions'
})
app.use(express.static(path.join(rootDir, 'public')))
app.use("/uploads",express.static(path.join(rootDir, 'uploads')))
app.use("/host/uploads",express.static(path.join(rootDir, 'uploads')))
app.use("/homes/uploads",express.static(path.join(rootDir, 'uploads')))

app.use(express.urlencoded({ extended: false }));


const randomstring = (length) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
};


const filter = (req, file, cb) => {
  // Check the MIME type
  if (file.mimetype === 'image/jpeg' || 
      file.mimetype === 'image/jpg' || 
      file.mimetype === 'image/png') {
    cb(null, true);   // Accept file
  } else {
    cb(null, false); // Reject
  }
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the folder where files will be stored
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Set a unique filename (optional: keep original name)
    cb(null, randomstring(10) + '-' + (file.originalname));
  }
});

const multeroption={
  storage , fileFilter: filter  
}
app.use(multer(multeroption).single('photo'))

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(session({
  secret:"The House Project",
  resave:false,
  saveUninitialized:true,
  store
}))

app.use((req,res,next)=>{
  req.isLoggedIn= req.session.isLoggedIn;
// req.isLoggedIn=req.get('cookie')? req.get('cookie').split('=')[1]==='true':false
next();
})

app.use(storeRouter);

app.use("/host",(req,res,next)=>{
  if(req.isLoggedIn){
    next();
  }
  else{
    res.redirect("/Login")
  }
})
app.use("/host", hostRouter);
app.use(authRouter);


app.use(errorsController.pageNotFound);



const PORT = 3000;
mongoose.connect(DB_PATH).then(()=>{
  console.log("Connected to MongoDB ");
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
});
}).catch(error=>{
  console.log("Error connecting to MongoDB ", error);
})