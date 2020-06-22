const express = require('express');
const config = require('config');
const router = express.Router();

const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route  POST api/profile
//@desc   Create or update user profile
//@access Private

router.post(
  '/',
  [
    check('firstName', 'first name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('educationLevel', 'Education level is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      name,
      occupation,
      educationLevel,
      resourceId,
      certifications,
      location,
      social,
    } = req.body;
  }
);
