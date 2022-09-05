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

/**
 * @route   DELETE api/posts/:id
 * @dec     delete posts of related id
 * @access   Private
 */
router.delete(
  '/:id',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    Post.findById(req.params.id)
      .then((post) => {
        // check for post owner
        if (post.user.toString() !== req.user.id) {
          return res
            .status(401)
            .json({ error: 'User is not owner of this post' });
        }
        // delete
        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch((err) => res.status(404).json({ error: err }));
      })
      .catch((err) => res.status(404).json({ error: err }));
  }
);

/**
 * @route   PUT api/posts/:id
 * @dec     update posts of related id
 * @access   Private
 */

router.put(
  '/:id',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    Post.findById(req.params.id).then((post) => {
      if (post.user.toString() !== req.user.id) {
        return res
          .status(401)
          .json({ error: 'this user is not authorized yo update this post' });
      } else
        (post.text = req.body.text),
          (post.title = req.body.title),
          post.save().then((post) => res.json(post));
    });
  }
);

module.exports = router;
