# Taxi Industry Socila Media.

This the Taxi Social media application, it's will help the drivers to connect more easily, But it will help taxi Rank Mananger the most, he will be able to collect the drivers information easy from the database without writing each drivers information in the book.

https://github.com/Ziphozenkosimthombe/Taxi_Industry/assets/123859903/e73a3764-afb1-4f32-b8f9-a4009d8ad8cd


## Table of contents

- [Overview](#overview)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Insatll it Local](#install-it-local)
  - [Things To Add](#things-to-add)
  - [Run](#run)
- [Author](#author)

## Overview

### Links

- Code URL: [code](https://github.com/Ziphozenkosimthombe/Taxi_Industry.git)
- Live Site URL: [taxi-industry](https://taxi-industry.me)

## My process

### Built with

- [EJS](https://ejs.co/) - templete engine
- CSS
- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [node.js](https://nodejs.org/) - Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.

- [express.js](https://expressjs.com/) - Node.js web application framework.
- [Cloudinary](https://cloudinary.com/) - store the images and get it as a URL.
- [Passport.js](https://www.passportjs.org/) - authentication middleware for Node.js.
- [MongoDb](https://www.mongodb.com/) - an open source NoSQL database management program.
- [Nodemailer](https://nodemailer.com/) - Nodejs application module.
- [Bcrypt](https://bcrypt-generator.com/) - A library to help with hash passwords.

### What I learned

These was my first biggest full stack application i use to build small full stack application so there so much things that i have learn while i was building the project.I have learn how to use Authentication in node.js using the passport.js so i decided to use passport-local because it much more easy to understand and it straight foward.

```js
exports.postSignup = async (req, res, next) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    const validationErrors = [];
    if (!validator.isEmail(req.body.email))
      validationErrors.push({ msg: "Please enter a valid email address." });
    if (!validator.isLength(req.body.password, { min: 8 }))
      validationErrors.push({
        msg: "Password must be at least 8 characters long",
      });
    if (req.body.password !== req.body.confirmPassword)
      validationErrors.push({ msg: "Passwords do not match" });

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("../signup");
    }
    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });

    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { userName: req.body.userName }],
    });

    if (existingUser) {
      req.flash("errors", {
        msg: "Account with that email address or username already exists.",
      });
      return res.redirect("../signup");
    }

    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      numberPlate: req.body.numberPlate,
      image: result.secure_url,
      cloudinaryId: result.public_id,
      role: req.body.role,
      complete: false,
      password: req.body.password,
    });
    const itemsLeft = await User.countDocuments({ complete: false });

    await user.save();

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/feed");
    });
  } catch (err) {
    return next(err);
  }
};
```

On my front-end side i did't write the javascript i only have css so what i learn is this amazing module call 'method-override' it just allows me to use HTTP verbs such as PUT or DELETE in places where the client doesn't support it, so method-override it just make my life and my work more easy.

```html
<form
  class="col-1"
  action="/post/likePost/<%= post._id %>?_method=PUT"
  method="POST">
  <button class="btn btn-primary fa fa-heart heart__btn" type="submit"></button>
</form>
```

I have also learn how to use the 'Bcrypt' libary that make hash passwork on my database side, so that i can not be able to see the users password.

```js
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
```

I also have try to take the chance implementing the nodemailer on my project and i found that very intresting and it was more easy to learn it and emplement it on my project and it work very well.

Another thing that i learn is to use bootstrap CSS framework for making the responsive website i was thinking i will found it more hard but when i start to implement it was very easy to learn and i found it be my best CSS Framewrok that i can use for my projects and make me not writing the many lines and CSS code, and save me more much time.

### Continued development

I will still continue develop my project and put more technologys that will make my work more easy like ReactJs when i am more comfortable with it i will use ReactJs as a templete engine instaed of ejs. I will also put more features on the application like the user be able to chat with each other in private, and see the user that like your post. I will also make the page for the passengers to be able to book the taxi if there are going as a group. ReactJs will make it easy for me to put all this features, and also in future i will use Tailwind it's seem it's a good CSS framework to be able to play around it.
I know for now the user can view each others profile i was having the reason to not do that but when i feel comfortable with other technologies I will implement that so that their can view each others profile but they will able to view only.

### Install It Local

To install it in your local machine:

- npm install

### Things To Add

- Create a .env file in config folder and add the following as key = value
  - PORT = 4141 (it can be any port eg: 4000)
  - DB_STRING = your database URI
  - CLOUD_NAME = your cloudinary cloud name
  - API_KEY = your cloudinary api key
  - API_SECRET = your cloudinary api secret

### Run

- npm start

## Author

- Portfolio - [zipho](https://zipho.netlify.app)
- Linkedin - [@ziphozenkosi](https://linkedin.com/in/ziphozenkosi)
- Twitter - [@ziphozenkosi478](https://www.twitter.com/ziphozenkosi478)
