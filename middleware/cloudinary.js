const cloudinary = require("cloudinary").v2;

/**
 * This code snippet exports the Cloudinary configuration object.
 * It requires the Cloudinary package and the dotenv package for environment variables.
 * The Cloudinary configuration object is set with the cloud name, API key, and API secret
 * from the environment variables defined in the .env file.
 *
 */

require("dotenv").config({ path: "./config/.env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

module.exports = cloudinary;
