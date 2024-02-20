const mongoose = require("mongoose");

/**
 * This code  defines two Mongoose schemas: CommentSchema and PostSchema.
 *
 * CommentSchema represents a comment and includes fields for the comment text, the user who made the comment,
 * the creation date, and the user's name.
 *
 * PostSchema represents a post and includes fields for the image URL, the cloudinary ID, the caption,
 * the number of likes, the users who liked the post, the user who made the post, an array of comments,
 * and the creation date.
 *
 * Both schemas are exported as Mongoose models.
 */

const CommentSchema = new mongoose.Schema({
  text: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userName: String, // Add a field to store the user's name
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PostSchema = new mongoose.Schema({
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  caption: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [CommentSchema], // Array of comments
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//MongoDB Collection named here - will give lowercase plural of name
module.exports = mongoose.model("Post", PostSchema);
