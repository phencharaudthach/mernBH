const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult, body } = require('express-validator');
const router = express.Router();

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

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userData = {
      email: req.body.email,
      password: req.body.password,
    };

    try {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);

      const user = await User.create(userData);

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
);

module.exports = router;
