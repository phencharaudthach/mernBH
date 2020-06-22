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
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
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

      const userId = req.user.id;

      const profileFields = {
        firstName,
        lastName,
        name,
      };
      profileFields.user = userId;
      if (occupation) profileFields.occupation = occupation;
      if (educationLevel) profileFields.educationLevel = educationLevel;
      if (resourceId) profileFields.resourceId = resourceId;
      if (certifications) profileFields.certifications = certifications;
      if (location) profileFields.location = location;

      profileFields.social = {};
      if (githubUrl) profileFields.social.githubUrl = githubUrl;
      if (twitterUrl) profileFields.social.twitterUrl = twitterUrl;
      if (youtubeUrl) profileFields.social.youtubeUrl = youtubeUrl;

      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
