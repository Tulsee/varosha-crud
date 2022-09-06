const passport = require('passport');

// load post model
const Post = require('../models/Post');

/**
 * @route   GET api/posts
 * @dec     Get posts
 * @access   Public
 */
exports.get_posts = (req, res) => {
  // destructuring page and limit and set default values
  const { page = 1, limit = 10 } = req.query;
  Post.count({}, function (err, count) {
    Post.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .then((posts) => {
        res.status(200).json({
          posts,
          count,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
        });
      });
  });
  // try {
  //   const count = Post.count();
  //   Post.find({})
  //     .limit(limit * 1)
  //     .skip((page - 1) * limit)
  //     .exec((err, posts) => {
  //       const count = posts.length;
  //       res.json({
  //         posts,
  //         totalPages: Math.ceil(count / limit),
  //         currentPage: page,
  //       });
  //     });

  // } catch (err) {
  //   res.status(400).json({ error: 'catch error' });
  // }
};

/**
 * @route   Post api/posts
 * @dec     Create posts
 * @access   Private
 */
exports.create_post =
  (passport.authenticate('jwt', {
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
  });

/**
 * @route   DELETE api/posts/:id
 * @dec     delete posts of related id
 * @access   Private
 */
exports.delete_post =
  (passport.authenticate('jwt', {
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
  });

/**
 * @route   PUT api/posts/:id
 * @dec     update posts of related id
 * @access   Private
 */

exports.update_post =
  (passport.authenticate('jwt', {
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
  });
