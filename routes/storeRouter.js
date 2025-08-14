// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const homesController = require("../controllers/storeController");
console.log("📦 storeRouter.js loaded");

storeRouter.get("/", homesController.getIndex);
storeRouter.get("/homes", homesController.getHomes);
storeRouter.get("/bookings", homesController.getBookings);
storeRouter.get("/favourites", homesController.getFavouriteList);
// storeRouter.post("/favourites", homesController.postFavouriteList);
storeRouter.post("/favourites", homesController.postFavouriteList);
storeRouter.post("/favourites/deletes/:homeID", homesController.postRemoveFromFavourite);
storeRouter.get("/homes/:homeId", homesController.getHomeDetails);

storeRouter.get("/rules/:homeId", homesController.getHomeRules);

module.exports = storeRouter;