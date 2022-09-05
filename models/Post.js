const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/// create Schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  text: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.naow,
  },
});

module.exports = Post = mongoose.model('post', PostSchema);
