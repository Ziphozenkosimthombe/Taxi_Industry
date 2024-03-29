const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

/**
 * This code  defines a UserSchema for a MongoDB database using Mongoose.
 * The UserSchema represents a user with properties such as userName, email, numberPlate, role, placeToDeliver, number, complete, image, cloudinaryId, and password.
 * It also includes middleware for password hashing and a helper method for validating the user's password.
 * The UserSchema is exported as a model named "User".
 */

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  numberPlate: { type: String, required: true },
  role: { type: String, enum: ["driver", "rank manager"] },
  placeToDeliver: { type: String, default: "Harding" },
  number: { type: Number, default: 0 },
  complete: { type: Boolean, default: false },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  password: String,
});

// Password hash middleware.

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword
) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      resolve(isMatch);
    });
  });
};
module.exports = mongoose.model("User", UserSchema);
