const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User");

/**
 * This Code exports an object containing various functions for handling profile, feed, taxi, and post operations.
 * Each function is an asynchronous function that handles specific operations such as fetching profile data, creating a new post, marking a task as complete and uncomplete, deleting the post, adding the comment to the post, like the post, etc...
 * These functions are used in different routes to perform the corresponding operations.
 *
 * getProfile: Fetches and sends the posts made by the logged-in user to the profile.ejs template.
 * getFeed: Fetches all posts, sorts them by likes in descending order, and sends them to the feed.ejs template.
 * getTable: Fetches all users, sorts them by number in ascending order, counts the users who have not completed their tasks, and sends this data to the taxi.ejs template.
 * getEdit: Fetches all users, sorts them by number in ascending order, and sends this data along with the id of the user to be edited to the edit.ejs template.
 * createPost: Uploads an image to Cloudinary, creates a new post with the uploaded image and the Caption, and redirects the user to the profile page.
 * markComplete: Marks a user's task as complete and redirects the user to the taxi table page.
 * markUncomplete: Marks a user's task as incomplete and redirects the user to the taxi table page.
 * likePost: Increments the likes of a post by 1 and redirects the user to the feed page.
 * updateEdit: Updates the number and placeToDeliver fields of a user and redirects the user to the taxi table page.
 * deletePost: Deletes a post and its associated image from Cloudinary and redirects the user to the feed page.
 * addComment: Adds a comment to a post and redirects the user to the post page.
 * deleteComment: Deletes a comment from a post and redirects the user to the post page.
 */

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      //Sending post data from mongodb and user data to ejs template
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("user")
        .sort({ likes: -1 })
        .lean();
      res.render("feed.ejs", {
        posts: posts,
        user: req.user,
      });
    } catch (err) {
      console.log(err);
    }
  },
  getTable: async (req, res) => {
    try {
      const texiItems = await User.find({
        role: { $ne: "rank manager" },
      }).sort({ number: 1 });
      const itemsLeft = await User.countDocuments({
        role: { $ne: "rank manager" },
        complete: false,
      });
      const user = req.user;
      res.render("taxi.ejs", { posts: texiItems, left: itemsLeft, user });
    } catch (err) {
      console.log(err);
    }
  },
  getEdit: async (req, res) => {
    try {
      const id = req.params.id;
      const itemsLeft = await User.find().sort({ number: 1 });
      res.render("edit.ejs", { posts: itemsLeft, texiId: id });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content
      await Post.create({
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  markComplete: async (req, res) => {
    try {
      await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { complete: true } }
      );

      console.log("Marked as complete");
      res.redirect("/taxiTable");
    } catch (err) {
      console.log(err);
    }
  },
  markUncomplete: async (req, res) => {
    try {
      await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { complete: false } }
      );

      console.log("Marked as uncomplete");
      res.redirect("/taxiTable");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/feed`); ///${req.params.id}
    } catch (err) {
      console.log(err);
    }
  },
  updateEdit: async (req, res) => {
    try {
      Object.keys(req.body).forEach((key) => {
        if (
          req.body[key] === null ||
          req.body[key] === undefined ||
          req.body[key] === ""
        ) {
          delete req.body[key];
        }
      });
      const id = req.params.id;
      const result = await User.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            number: req.body.number,
            placeToDeliver: req.body.placeToDeliver,
          },
        }
      );
      console.log("Updated");
      res.redirect("/taxiTable");
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      if (!post) {
        return res.status(404).send("Post not found");
      }

      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await post.deleteOne({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/feed");
    } catch (err) {
      res.redirect("/feed");
    }
  },
  addComment: async (req, res) => {
    try {
      const { postId } = req.params;
      const { text } = req.body;

      // Find the user who is adding the comment
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Fetch the userName associated with the user
      const username = user.userName; // Assuming the username is stored in a field called 'username'

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      // const Name = user.userName; // Assuming the username is stored in a field called 'username'
      // console.log("User Name:", Name);

      post.comments.push({
        text: text,
        user: req.user.id,
        userName: username,
        // Store the user's name with the comment
      });

      await post.save();

      res.redirect(`/post/${postId}`); // Redirect to a page that displays the single post and its comments
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  },

  // Delete a comment from a post
  deleteComment: async (req, res) => {
    try {
      const { postId, commentId } = req.params;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send("Post not found");
      }

      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).send("Comment not found");
      }

      comment.deleteOne();
      await post.save();

      res.redirect(`/post/${postId}`);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  },

  // deleteAccountAndPosts: async (req, res) => {
  //   try {
  //     // Find user by ID
  //     const user = await User.findById(req.user.id);
  //     if (!user) {
  //       return res.status(404).send("User not found");
  //     }

  //     // Find and delete user's posts
  //     const userPosts = await Post.find({ user: req.user.id });
  //     for (const post of userPosts) {
  //       // Delete image from Cloudinary
  //       await cloudinary.uploader.destroy(post.cloudinaryId);
  //       // Delete post from database
  //       await post.deleteOne();
  //     }

  //     // Delete user
  //     await user.deleteOne();

  //     console.log("User account and associated posts deleted successfully");
  //     // Redirect user to a relevant page (e.g., home page or login page)
  //     res.redirect("/");
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).send("Internal Server Error");
  //   }
  // },
};
