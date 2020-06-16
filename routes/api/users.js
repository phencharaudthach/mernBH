const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult, body } = require('express-validator');
const router = express.Router();
const isEmpty = require('../../utils/isEmpty');
const user = require('../../models/User');
const User = require('../../models/User');
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

    if (!isEmpty(existing)) {
      return res.status(400).json({ email: 'Email exists' });
    }

    const userData = {
      email: req.body.email,
      password: req.body.password,
    };

    try {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);

      // create a code that will check if email is already in use before creating the new user.
      let user = await User.findOne({ email: userData.email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'email already exists' }] });
      }
      const user = await User.create(userData);

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
);

// @route PUT api/users/
// @desc login a user
// @access PUBLIC

router.push(
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
        return req.status(404).json({ email: 'email not found' });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        return res.status(401).json({ password: 'Incorrect password' });
      }

      //validation! challenge create the token and return to the user
    } catch (err) {
      console.error(error);
      res.status(500).json(error);
    }
  }
);

module.exports = router;
