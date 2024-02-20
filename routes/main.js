const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth } = require("../middleware/auth");

/**
 * This code  represents a router module in an server.js application.
 * It defines various routes for different functionalities such as authentication, home, and posts.
 * The routes are associated with corresponding controller functions.
 * The module exports the router object for use in the main application.
 */

//Main Routes
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/taxiTable", ensureAuth, postsController.getTable);
router.get("/edit/:id", ensureAuth, postsController.getEdit);
router.post("/updateEdit/:id", postsController.updateEdit);

//Auth Routes
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", upload.single("file"), authController.postSignup);

module.exports = router;
