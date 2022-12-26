const jwt = require('jsonwebtoken');

require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

function verifyTokenMiddleware(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  
}


function verifyUserMiddleware(req, res, next){

  jwt.verify(req.token, JWT_SECRET_KEY, (err, data) => {
    if(err) {
      res.sendStatus(403);
    } else{
      req.role = data.user.role
      req.userID = data.user.user_id;
      next();
    }})

}


module.exports = {
    verifyTokenMiddleware,
    verifyUserMiddleware
}