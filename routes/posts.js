const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const homeController = require("../controllers/home");
const { ensureAuth } = require("../middleware/auth");

/**
 * This code snippet represents a router module in an Express.js application.
 * It defines various routes for handling posts, comments.
 * The routes are organized using the Express Router and are associated with their respective controller functions.
 * Middleware functions are used to ensure authentication and handle file uploads.
 *
 * @module router
 * @requires express
 * @requires ../middleware/multer
 * @requires ../controllers/posts
 * @requires ../controllers/home
 * @requires ../middleware/auth
 *
 * @example
 * // Import the router module
 * const router = require("./router");
 *
 * // Use the router in the Express app
 * app.use("/posts", router);
 */

//Post Routes
//Since linked from server js treat each path as:
//post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
router.get("/:id", ensureAuth, postsController.getFeed);

//Enables user to create post w/ cloudinary for media uploads
router.post("/createPost", upload.single("file"), postsController.createPost);
router.post("/:postId/comment", ensureAuth, postsController.addComment);
router.post("/contact", homeController.sendEmail);

//Enables user to like post. In controller, uses POST model to update likes by 1
router.put("/likePost/:id", postsController.likePost);
router.put("/markComplete/:id", postsController.markComplete);
router.put("/markUncomplete/:id", postsController.markUncomplete);

//Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
router.delete("/deletePost/:id", postsController.deletePost);
router.delete(
  "/:postId/comment/:commentId",
  ensureAuth,
  postsController.deleteComment
);
module.exports = router;
