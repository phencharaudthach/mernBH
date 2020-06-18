const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
    },
    educationLevel: {
      type: String,
      enum: [
        'Some High School',
        'High School',
        'GED',
        'College',
        'Some College',
        'College',
        'Masters',
        'PHD',
        'Technical School',
        'BootCamp',
      ],
      required: true,
    },
    resourceId: {
      type: [Schema.Types.ObjectId],
      ref: 'resources',
    },
    certifications: [String],
    location: {
      city: String,
      state: String,
    },
    social: {
      githubUrl: String,
      twitterUrl: String,
      youtubeUrl: String,
    },
    summary: String,
    Avatar: String,
  },
  { timestamps: {} }
);

module.exports = Profile = mongoose.model('profiles', profileSchema);
