const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
    },
    educationLevel: {
      type: String,
    },
    resourceId: {
      type: [String],
    },
    certifications: {
      type: [String],
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    twitterUrl: {
      type: String,
    },
    youtubeUrl: {
      type: String,
    },
    summary: {
      type: String,
    },
  },
  { timestamps: {} }
);

module.exports = Profile = mongoose.model('profile', profileSchema);
