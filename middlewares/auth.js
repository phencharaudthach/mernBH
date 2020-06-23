const jwt = require('jsonwebtoken');
const config = require('../config');

const name = (req, res, next) => {
  //either:
  //respond to the front end and end early
  //or
  // call next();
  next();
};

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'Invalid Authorization' });
  }
  try {
    const decoded = jwt.verify(token, config.secretOrKey);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(error);
    return res.status(500).json(error);
  }
};
module.exports = auth;
