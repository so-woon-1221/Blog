const mongoose = require('mongoose');

const { Schema } = mongoose;
const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  content: String,
  thumbnail: String,
  category: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  postDate: {
    type: String,
  },
});

module.exports = mongoose.model('Post', postSchema);
