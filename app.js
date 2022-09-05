const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

const users = require('./routes/api/users');
const posts = require('./routes/api/posts');

// middleware for body-parser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// load config
const db = require('./config/mongoURI').mongoURI;

// connection to mongoDB
mongoose
  .connect('mongodb://localhost/varosa', {
    useNewUrlParser: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// middleware for passport
app.use(passport.initialize());

// passport config
require('./config/passport')(passport);

// use Routes
app.use('/api/users', users);
app.use('/api/posts', posts);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
