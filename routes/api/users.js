const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// load user Model
const User = require('../../models/User');

// load keys
const keys = require('../../config/mongoURI').secretOrKey;

/**
 * @route GET api/users/test
 * @dec    Tests user route
 * @access  Public
 */
router.get('/test', (req, res) => {
  res.json({
    msg: 'Running /api/users/test',
    register: '/api/user/register',
  });
});

/**
 * @route   GET api/users/register
 * @dec     register user route
 * @access  Public
 */
router.post('/register', (req, res) => {
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      errors = 'Email already exist';
      return res.status(400).json({ error: errors });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          if (err) throw err;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => {
              console.log(err);
            });
          res.json(newUser);
        });
      });
    }
  });
});

module.exports = router;
