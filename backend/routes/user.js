const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        let errorMessage = "Invalid authentication credentials!";
        if (err.code === 11000) {
          errorMessage = "Email is already in use!";
        }
        res.status(500).json({
          message: errorMessage,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let user;
  User.findOne({ email: req.body.email })
    .then((fetchedUser) => {
      if (!fetchedUser) {
        return res.status(401).json({
          message: "You need to signup before logging in!",
        });
      }
      user = fetchedUser;
      return bcrypt.compare(req.body.password, fetchedUser.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid authentication credentials!",
        });
      }
      const token = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.MEAN_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: user._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials!",
      });
    });
});

module.exports = router;
