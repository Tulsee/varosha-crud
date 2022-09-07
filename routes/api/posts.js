const express = require('express');
const router = express.Router();
const passport = require('passport');

const postController = require('../../controller/post');

router
  .get('/', postController.get_posts)
  .post(
    '/',
    passport.authenticate('jwt', { session: false }),
    postController.create_post
  )
  .delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    postController.delete_post
  )
  .put(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    postController.update_post
  );

module.exports = router;
