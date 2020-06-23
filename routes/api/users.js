const express = require('express');
const { check, validationResult, body } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isEmpty = require('../../utils/isEmpty');
const config = require('../../config');

const User = require('../../models/User');
// @route POST api/users/
// @desc create a user
// @access PUBLIC

router.post(
  '/',
  [
    check('email', 'Email Required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {

      const userData = {
        email: req.body.email,
        password: req.body.password,
      };

      const existingUser = await User.findOne({email: userData.email});
      if (!isEmpty(existingUser)){
        return res.status(400).json({errors: {email: "Email in use"}});
      }

      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);


      // create a code that will check if email is already in use before creating the new user.
      // let user = await User.findOne({ email: userData.email });
      
      const user = await User.create(userData);
      const keys = Object.keys(user._doc);
      console.log(keys);
     return res.json(user);
    } catch (error) {
      console.error(error);
     return res.status(500).json(error);
    }
  }
);

// @route PUT api/users/
// @desc login a user
// @access PUBLIC

router.put(
  '/',
  [
    check('email', 'Email Required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password Required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      if (isEmpty(user)) {
        return req.status(400).json({ errors: {message: "Invalid Login"} });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Login" });
      }

      //validation! challenge create the token and return to the user
      // information => encoder + key => token => decoder + key => information

      User.findByIdAndUpdate(user.id, { lastLogin: Date.now() });

      const payload = {
        id: user.id,
        email: user.email,
      };

      const token = jwt.sign(payload, config.secretOrKey, {});

      return res.json(token);
      
    } catch (error) {
      console.error(errors);
      res.status(500).json(errors);
    }
  }
);

module.exports = router;
