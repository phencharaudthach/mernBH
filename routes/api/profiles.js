const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const auth = require('../../middlewares/auth');

//@route  POST api/profile
//@desc   Create or update user profile
//@access Private
router.post(
  '/',
  auth,
  [
    check('firstName', 'first name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('educationLevel', 'Education level is required').not().isEmpty(),
    check('social.githubUrl', 'Invalid URL').optional().isURL(),
    check('social.twitterUrl', 'Invalid URL').optional().isURL(),
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
        occupation,
        educationLevel,
        certifications,
        location,
        githubUrl,
        twitterUrl,
        youtubeUrl,
        summary,
      } = req.body;

      const userId = req.user.id;

      const profileFields = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        educationLevel,
      };

      profileFields.name = `${profileFields.firstName} ${profileFields.lastName}`;

      profileFields.user = userId;
      if (occupation) profileFields.occupation = occupation;
      if (certifications) profileFields.certifications = certifications;
      if (location) profileFields.location = location;
      if (summary) profileFields.summary = summary;

      profileFields.social = {};
      if (social) {
        if (social.githubUrl) profileFields.social.githubUrl = social.githubUrl;
        if (social.twitterUrl)
          profileFields.social.twitterUrl = social.twitterUrl;
        if (social.youtubeUrl)
          profileFields.social.youtubeUrl = social.youtubeUrl;
      }

      const profile = await Profile.create(profileFields);
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// get /self return logged in profile data. authenticated route

router.get('/self', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name']);

    if (!profile) {
      return res
        .status(400)
        .json({ message: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get / return all profiles - hacker challenge one -> exclude logged in user from results. Hint: query hacker challenge 2 -> excluded location data. Hint: projections

router.get('/', auth, async (req, res) => {
  try {
    const currentProfile = await Profile.findOne({ user: req.user.id });
    console.log(currentProfile);
    const profiles = await Profile.find(
      { _id: { $ne: currentProfile } },
      { experience: 0 }
    ).populate('user', ['name']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put(
  '/:id',
  auth,
  [
    check('firstName', 'first name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('educationLevel', 'Education level is required').not().isEmpty(),
    check('social.githubUrl', 'Invalid URL').optional().isURL(),
    check('social.twitterUrl', 'Invalid URL').optional().isURL(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const postData = { ...req.body };
      const profile = await Profile.findOneAndUpdate(
        {
          profile: profile._id,
        },
        profileData,
        { new: true }
      );
      if (!profile) {
        res.status(403).json({ msg: ' Unable To Update' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json('Server Error');
    }
  }
);

router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    res.json({ msg: 'Profile was removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
