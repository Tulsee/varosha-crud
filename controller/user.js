const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// load user Model
const User = require('../models/User');

// load keys
const keys = require('../config/mongoURI').secretOrKey;

/**
 * @route GET api/users/test
 * @dec    Tests user route
 * @access  Public
 */
exports.get_user_api_list = function (req, res) {
  res.json({
    msg: 'Running /api/users/test',
    register: '/api/users/register',
    login: '/api/users/login',
    current: '/api/users/current',
  });
};

exports.get_user_api = function (req, res) {
  res.json({
    msg: 'Running /api/users/test',
    register: '/api/users/register',
    login: '/api/users/login',
    current: '/api/users/current',
  });
};
/**
 * @route   POST api/users/register
 * @dec     register user route
 * @access  Public
 */
exports.register_user = function (req, res) {
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
};

/**
 * @route   POST api/users/login
 * @dec     Login user route / returing jwt token
 * @access   Public
 */
exports.login_user = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // finding user by their email
  User.findOne({
    email: email,
  }).then((user) => {
    if (!user) {
      error = 'USER not Found with this email';
      return res.status(404).json({ error: error });
    }
    // checking password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //password matched
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        jwt.sign(
          payload,
          keys,
          {
            expiresIn: 36000,
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
            });
          }
        );
      } else {
        // password not matched
        error = 'password is Incorrect';
        return res.status(400).json({ error: error });
      }
    });
  });
};

//@route    GET api/users/current
//@dec      Return current user
//@access   Private
exports.get_current_user_detail =
  (passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  });
