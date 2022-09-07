const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

const postRoutes = require('./routes/api/posts');
const userRoutes = require('./routes/api/users');

// middleware for body-parser

app.use(bodyParser.json());

// load config
const db = require('./config/mongoURI').mongoURI;
require('./models/Post');
require('./models/User');

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
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/user', userRoutes);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
