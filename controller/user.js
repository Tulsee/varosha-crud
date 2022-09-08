const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const { authSchema, registerSchema } = require('../helpers');

// load user Model
const User = require('../models/User');

// load keys
const { secretOrKey } = require('../config');

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
  let { value, error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error);
  } else {
    User.findOne({
      email: value.email,
    }).then((user) => {
      if (user) {
        errors = 'Email already exist';
        return res.status(400).json({ error: errors });
      } else {
        const newUser = new User(value);
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
  }
};

/**
 * @route   POST api/users/login
 * @dec     Login user route / returing jwt token
 * @access   Public
 */
exports.login_user = (req, res) => {
  let { value, error } = authSchema.validate(req.body);
  // finding user by their email
  if (error) {
    return res.status(400).json(error);
  } else {
    User.findOne({
      email: value.email,
    }).then((user) => {
      if (!user) {
        error = 'USER not Found with this email';
        return res.status(404).json({ error: error });
      }
      // checking password
      bcrypt.compare(value.password, user.password).then((isMatch) => {
        if (isMatch) {
          //password matched
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
          };
          jwt.sign(
            payload,
            secretOrKey,
            {
              expiresIn: 36000,
            },
            (err, token) => {
              res.json({
                success: true,
                token: token,
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
  }
};

//@route    GET api/users/current
//@dec      Return current user
//@access   Private
exports.get_current_user_detail = (req, res) => {
  console.log(req.headers);
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
};

/**
 * @route     POST api/v1/user/fileupload
 * @dec       Upload files
 * @access    Public
 */
exports.upload_file = (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }
  let sampleFile = req.files.sampleFile;

  let uploadPath = 'public/' + sampleFile.name;
  sampleFile.mv(uploadPath, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ detail: 'File uploaded' });
  });
};
