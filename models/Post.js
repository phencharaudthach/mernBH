const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'profiles',
  },
  text: String,
  likes: { type: [Schema.Types.ObjectId], default: [] },
  timestamps: {},
});

const postSchema = new Schema({
  poster: {
    type: Schema.Types.ObjectId,
    ref: 'profiles',
  },
  author: { type: String, required: true },
  skillLevel: {
    type: String,
    enum: [
      'Beginner',
      'Intermediate',
      'Advanced',
      'Associate',
      'Junior',
      'Senior',
      'Lead',
    ],
    required: true,
  },
  cohort: String,
  title: { type: String, required: true },
  categories: { type: [String], default: [] },
  summary: String,
  link: { type: String, required: true },
  resourceType: {
    type: String,
    enum: [
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
    ],
    required: true,
  },
  publishedAt: Date,
  videoLength: Number,
  timeToComplete: Number,
  cost: { type: Number, required: true },
  comments: { type: [commentSchema], default: [] },
  likes: {
    type: { type: [Schema.Types.ObjectId],
    default: []},
  },
});

module.exports = Post = mongoose.model('posts', postSchema);
