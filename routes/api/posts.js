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

const postValidator = [
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
];

// @route		POST api/posts
// @desc		create a new post
// @access	private

router.post('/', auth, [...postValidator], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const profileId = profile._id;

    const postData = { ...req.body };
    postData.poster = profileId;

    const post = await Post.create(postData);
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// @route		GET api/posts/
// @desc		Get all posts
// @access	public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('poster', 'name Avatar');
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// @route		GET api/posts/:id
// @desc		get a post based on id number
// @access	public
router.get('/:id', async (req, res) => {
  try {
    const post = Post.findById(req.params.id).populate('poster', 'name Avatar');
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// @route		PUT api/posts/:id
// @desc		update an existing post based on id
// @access	owner
router.put('/:id', auth, [...postValidator], async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      res.status(403).json({ msg: 'No profile' });
    }

    const postData = { ...req.body };

    const post = await Post.findOneAndUpdate(
      {
        _id: req.params.id,
        poster: profile._id,
      },
      postData,
      { new: true }
    );
    if (!post) {
      res.status(403).json({ msg: ' Unable To Update' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.put("/:postID/like", auth, async (req, res) => {
try {
  let post;
  if(req.body.like){
    // add the user id to likes
   post = await Post.findByIdAndUpdate(req.params.postID, {$addToSet: {likes: req.user.id}},
    {new: true});
  } else {
    // remove the specific userid from likes
   post = await Post.findByIdAndUpdate(req.params.postId, {$pull: {likes: req.user.id}}, {
     new: true
   });
  }
  return res.json(post.likes.length);

} catch (error) {
  console.error(error);
 return res.status(500).json(error)
}
})

// *** NonLocking
router.delete("/:postID/:commentID", auth, async (req, res)=> {
try {
  const post = await Post.findById(req.params.postID);
  if(!post) {
    return res.status(404).json({msg: "Post not found"});
  }
  const comment = post.comments.find(
    (comment) => comment.id === req.params.commentID
  );

  if (!comment) {
    return res.status(404).json({msg: "Comment not found"})
  }

  const profile = await Profile.findOne({user: req.user.id});

  if (profile.id !== post.comments[index].profile) {
    return res.status(401).json({msg: "Unauthorized"});
  }

  const updatedPost = await Post.findByIdAndUpdate(req.params.postID, {
    $pull: {comments: {id: req.params.id, profile: profile.id}},
  })
} catch (error) {
  console.error(error);
  return res.status(500).json(error)
}
})

module.exports = router;
