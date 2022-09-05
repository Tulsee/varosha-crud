const express = require('express');
const passport = require('passport');

const router = express.Router();
// load post model
const Post = require('../../models/Post');

/**
 * @route   GET api/posts
 * @dec     Get posts
 * @access   Public
 */
router.get('/', (req, res) => {
  Post.find()
    .sort({
      date: -1,
    })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ error: 'no post found' }));
});

/**
 * @route   Post api/posts
 * @dec     Create posts
 * @access   Private
 */
router.post(
  '/',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    console.log(req.user);
    const newPost = new Post({
      text: req.body.text,
      title: req.body.title,
      user: req.user.id,
    });
    // res.json(newPost);
    newPost.save().then((post) => res.json(post));
  }
);

module.exports = router;
