const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../../controller/user');

router
  .post('/register', userController.register_user)
  .get('/', userController.get_user_api_list)
  .post('/login', userController.login_user)
  .get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    userController.get_current_user_detail
  );

module.exports = router;
