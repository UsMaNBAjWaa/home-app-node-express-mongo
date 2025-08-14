// External Module
const express = require("express");
const hostRouter = express.Router();
const Home = require("../models/home");

// Local Module
const hostController = require("../controllers/hostController");

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.get("/host-home-list", hostController.getHostHomes);
hostRouter.get("/edit-homes/:homeid", hostController.getEditHomes);
hostRouter.post("/delete-home/:homeId",hostController.postDeleteHome);
hostRouter.post("/edit-homes", hostController.postEditHome);


module.exports = hostRouter;