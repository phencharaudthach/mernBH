const express = require('express');
const router = express.Router;
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

router.get('/test', (req, res) => {
  res.json({ message: 'This is a test for post route' });
});

router.post(
  '/',
  auth,
  [
    check('author', 'Author is required').notEmpty(),
    check('skillLevel', 'Skill level is required').notEmpty(),
    check('skillLevel', 'Please select from the dropdown').isIN([
      'Beginner',
      'Intermediate',
      'Advanced',
      'Associate',
      'Junior',
      'Senior',
      'Lead',
    ]),
    check('title', 'Title is required').notEmpty(),
    check('link', 'A useable link is required').notEmpty(),
    check('link', 'Valid URL is required').isURL(),
    check('resouceType', 'A valid resource type is required').notEmpty(),
    check('resourceType', 'Please select from the dropdown').isIn([
      'Article',
      'Video',
      'SlideShow',
      'Book',
      'eBook',
      'PDF',
      'PodCast',
      'Website',
      'Newsletter',
      'Blog',
      'Other',
    ]),
    check('cost', 'Cost is required').notEmpty(),
    check('cost', 'A valid number is required').isNumeric(),
    check('publishedAt', 'Invalid Date').optional().isISO8601(),
    check('videoLength', 'Length of video must be a number')
      .optional()
      .isNumeric(),
    check('timeToComplete', 'Time took to complete must be a number')
      .optional()
      .isNumberic(),
  ],
  async,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.json(req.body);
  }
);

module.exports = router;
