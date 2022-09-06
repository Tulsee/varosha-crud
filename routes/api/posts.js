const express = require('express');
const router = express.Router();

const postController = require('../../controller/post');

router
  .get('/', postController.get_posts)
  .post('/', postController.create_post)
  .delete('/:id', postController.delete_post)
  .put('/:id', postController.update_post);

module.exports = router;
