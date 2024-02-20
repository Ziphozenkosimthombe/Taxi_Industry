const mongoose = require("mongoose");

/**
 * Function: connectDB
 *
 * Description:
 * This function is responsible for establishing a connection to a MongoDB database using the Mongoose library.
 * It takes no parameters and returns nothing.
 *
 * Usage:
 * 1. Import the function using 'require' statement.
 * 2. Call the function to connect to the MongoDB database specified in the 'DB_STRING' environment variable.
 * 3. If the connection is successful, it will log a message indicating the host of the connected MongoDB instance.
 * 4. If an error occurs during the connection, it will log the error and exit the process with code 1.
 *
 */

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_STRING);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
