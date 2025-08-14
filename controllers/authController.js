const { check,validationResult } = require("express-validator");
const User = require("../models/User")
const bcrypt = require("bcryptjs")
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login page",
    currentPage: "Login",
    isLoggedIn:false,
    errors: [],
    oldInput: { email:""},
    user:{}
  });
};
exports.postLogin = async(req, res, next) => {
  console.log(req.body)
  const{email,password}=req.body
  const user= await User.findOne({email});
  if(!user)
  {
    return res.status(500).render("auth/login", {
      pageTitle: "Login page",
      currentPage: "Login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput: { email},
      user:{}
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).render("auth/login", {
      pageTitle: "Login page",
      currentPage: "Login",
      isLoggedIn: false,
      errors: ["Invalid password"],
      oldInput: { email },
      user:{}
    });
  }
  // req.isLoggedIn =true;
  req.session.isLoggedIn=true
  req.session.user = user;
  console.log("I am user saver",req.session.user)
  await req.session.save();

   res.redirect("/")
};
exports.postLogout = (req, res, next) => {
  req.session.isLoggedIn=false        // but this works better
  res.redirect("/login")

//  req.session.destroy(()=>{         this one is best 

//    res.redirect("/login")
//  })
};
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup Page",
    currentPage: "Signup",
    isLoggedIn:false,
    errors:[],
    oldInput:{firstname:"",lastname:"",email:"",password:"",userType:""},
    user:{}
  });
};
exports.postSignup = [
  check("firstname")
  .trim()
  .isLength({min:2})
    .withMessage("First Name should be at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)//+ means minimum 1 character
    .withMessage("First Name should only contain letters and spaces"),

  check("lastname")
    .matches(/^[a-zA-Z\s]*$/)// * means 0 or more characters
    .withMessage("Last Name should only contain letters and spaces"),
    
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),// for save special characters in email
  check("password")
    .isLength({min:8})
    .withMessage("Password should be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain atleast one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one Number")
    .matches(/[!@&]/)
    .withMessage("Password should contain atleast one special character")
    .trim(),
  check("confirmPassword")
  .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    check("userType")
    .notEmpty()
    .withMessage("Please select the user type")
    .isIn(['guest','host'])
    .withMessage("Invalid user type"),

    check("terms")  
    .notEmpty()
    .withMessage("Please accept the terms and conditions")        
    .custom((value,{req})=>{
      if(value!=="on")
      {
        throw new Error("Please accept the terms and conditions");
      }
      return true
    }),   

  
  (req, res, next) => {
    const{firstname,lastname,email,password,userType}=req.body
    const errors= validationResult(req);
    if(!errors.isEmpty())
    {
      return res.status(422).render("auth/signup",{
        pageTitle: "Signup Page",
        currentPage: "Signup",
        isLoggedIn:false,
        errors:errors.array().map(err=>err.msg),
        oldInput:{firstname,lastname,email,password,userType},
        user:{}
      })
    }
    bcrypt.hash(password, 12)
      .then(hashedPassword => {
      const user = new User({ firstname, lastname, email, password: hashedPassword, userType });
      return user.save();
      })
      .then(() => {
      res.redirect("/login");
      })
      .catch(err => {
      console.error(err);
      return res.status(500).render("auth/signup", {
        pageTitle: "Signup Page",
        currentPage: "Signup",
        isLoggedIn: false,
        errors: [err.msg],
        oldInput: { firstname, lastname, email, password, userType },
        user:{}
      });
      });
}]

