const nodemailer = require("nodemailer");

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
    } catch(err) {
      console.log(err);
      return res.status(500).send("Error while sending email");
    }
  
    const mailOptions = {
      from: req.body.email, // sender's email
      to: "ziphoncayiyana@gmail.com", // your email
      subject: req.body.subject, // Subject from form
      text: req.body.message, // Message from form
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        return res.status(500).send("Error while sending email");
      } else {
        console.log("Email sent: ", info.response);
        return res.send('Thank you for your message. We will get back to you soon!');
      }
    });    
  }
};
