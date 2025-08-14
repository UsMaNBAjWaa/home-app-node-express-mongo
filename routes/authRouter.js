// External Module
const express = require("express");
const authRouter = express.Router();

// Local Module
const authController = require("../controllers/authController");
console.log("📦 storeRouter.js loaded");

authRouter.get("/Login", authController.getLogin);
authRouter.post("/Login", authController.postLogin);
authRouter.post("/Logout", authController.postLogout);
authRouter.get("/Signup", authController.getSignup);
authRouter.post("/Signup", authController.postSignup);


module.exports = authRouter;