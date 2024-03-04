// require nodemailer
const nodemailer = require("nodemailer");

/**
 * This code snippet exports an object with two methods: getIndex and sendEmail.
 *
 * - getIndex: This method renders the "index.ejs" template.
 *
 * - sendEmail: This method sends an email using the nodemailer library. It creates a transporter
 *   using the Gmail service and SMTP settings. It takes the sender's email, subject, and message
 *   from the request body and sends an email to the specified recipient. If the email sending is
 *   successful, it logs the response and sends a success message. If there is an error, it logs
 *   the error and sends an error response.
 *
 */

module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs");
  },
  sendEmail: async (req, res) => {
    try {
      console.log(req.body);

      // Create transporter
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });

      // Set mailOptions
      const mailOptions = {
        from: req.body.email,
        to: "ziphoncayiyana@gmail.com",
        subject: `Message from ${req.body.email}: ${req.body.subject}`,
        text: req.body.message,
      };

      // Send mail
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
          return res.status(500).send("Error while sending email");
        } else {
          console.log("Email sent: " + info.response);
          res.send("success");
          res.redirect("/index");
        }
      });
    } catch (err) {
      console.error("Error sending email: ", err);
      return res.status(500).send("Error while sending email");
    }
};
