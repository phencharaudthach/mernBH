const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// confirm login
// get the post by post id
// check if it exists
// pull the profile from the userid
// add the comment to the post (text and profileid)
// confirm the comment was added successfully
// send the comment array back to the requester
/* NonLocking version
router.post('/:postID', auth, async (req, res) => {
try {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({msg: "Unable to find post"})
    }
    const profile = await Profile.findOne({user: req.user.id});
    if(!profile) {
        return res.status(400).json({msg: "Profile required"});
    }
    const comment = {text: req.body.text, profile: profile.id};
    post.comment.push(comment);
    post.save(post);
    res.json(post.comments);
} catch (error) {
    console.error(error)
    res.status(500).json(error)
}
}) */

// Locking version
router.post(":/postID", auth, async, (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        if(!profile) {
            return res.status(400).json({msg: "Profile required"});
        }
        const comment = {text: req.body.text, profile: profile.id};
        const post = await Post.findByIdAndUpdate(req.params.id, {$push: {comments: comment}}, {new: true});
        return res.json(post.comments);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
})

// check logged in
// get the comment
// check if user is owner of comment
// delete the comment
// return comment array to requester

router.delete("/:postID/:commentID", auth, async (req, res) => {
try {
    
} catch (error) {
    console.error(error);
    res.status(500).json(error);
}
})