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
    let transporter;
    try {
      transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "ziphoncayiyana@gmail.com",
          pass: "bjup udgo zmsd uhsh",
        },
      });

      // mailOptions
      const mailOptions = {
        from: req.body.email, // sender's email
        to: "ziphoncayiyana@gmail.com", // your email
        subject: req.body.subject, // Subject from form
        text: req.body.message, // Message from form
      };

      // feedback massage
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
          return res.status(500).send("Error while sending email");
        } else {
          console.log("Email sent: ", info.response);
          return res.send(
            "Thank you for your message. We will get back to you soon!"
          );
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error while sending email");
    }
  },
};
