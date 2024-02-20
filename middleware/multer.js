const multer = require("multer");
const path = require("path");

/**
 * This code  exports a multer middleware configuration.
 * Multer is a middleware for handling multipart/form-data, which is primarily used for file uploads.
 * The code snippet configures multer to use disk storage for storing uploaded files.
 * It also defines a file filter function that only allows files with extensions .jpg, .jpeg, and .png.
 * If a file with an unsupported extension is uploaded, an error is returned.
 */

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
