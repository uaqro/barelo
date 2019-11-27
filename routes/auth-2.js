require("dotenv").config();
const router = require("express").Router();
const User = require("../models/User");
const passport = require("../config/passport");
const uploadCloud = require("../config/cloudinary.js");

router.get("/signup", (_, res, next) => {
  res.render("auth/signup");
});
router.get("/login", (_, res, next) => {
  res.render("auth/login");
});
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/auth/login");
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      return res.redirect("/user/index");
    });
  })(req, res, next);
});
router.post("/signup", uploadCloud.single("photo"), (req, res, next) => {
  const { name, email, password, address, lng, lat } = req.body;
  const { secure_url } = req.file;
  User.register(
    {
      email,
      name,
      place: {
        address,
        coordinates: [lng, lat]
      },
      photoURL: secure_url
    },
    password
  )
    .then(user => res.redirect("/login"))
    .catch(err => {
      if (err.email === "UserExistsError") {
        return res.render("auth/signup", {
          msg: "You're already registered"
        });
      } else {
        console.log(err);
      }
    });
});

module.exports = router;
// solo porque el user tiene plm, podemos utilizar register
