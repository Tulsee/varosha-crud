const express = require('express');
const router = express.Router();

const userController = require('../../controller/user');

router
  .post('/test', userController.get_user_api)
  .post('/register', userController.register_user)
  .get('/', userController.get_user_api_list)
  .post('/login', userController.get_current_user_detail)
  .get('/current', userController.get_current_user_detail);

module.exports = router;
