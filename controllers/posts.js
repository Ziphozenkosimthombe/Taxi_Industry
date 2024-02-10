const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    // console.log(req.user);
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
      const texiItems = await User.find().sort({ number: 1 });
      const itemsLeft = await User.countDocuments({ complete: false });
      res.render("taxi.ejs", { posts: texiItems, left: itemsLeft });
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
        title: req.body.title,
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
        { $set: { complete: true } },
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
        { $set: { complete: false } },
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
        },
      );
      console.log("Likes +1");
      res.redirect(`/feed`); ///${req.params.id}
    } catch (err) {
      console.log(err);
    }
  },
  updateEdit: async (req, res) => {
    try {
      console.log(req.body);
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
        },
      );
      console.log(result);
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
};
