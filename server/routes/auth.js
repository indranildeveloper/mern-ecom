const express = require("express");
const { check } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    check("firstname")
      .isLength({ min: 3 })
      .withMessage("First Name should be 3 characters long!"),
    check("lastname")
      .isLength({ min: 3 })
      .withMessage("Last Name should be 3 characters long!"),
    check("email").isEmail().withMessage("Please enter a valid email!"),
    check("password", "The password must be 6+ chars long and contain a number")
      .not()
      .isIn(["123", "password", "god"])
      .withMessage("Do not use a common password")
      .isLength({ min: 6 })
      .matches(/\d/),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Please enter a valid email!"),
    check("password", "Password is required!").isLength({ min: 3 }),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
