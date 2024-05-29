const jwt = require("jsonwebtoken");

const secretKey = "secretKey";

// 生成token
var generateToken = function (payload) { 
  const token =
    jwt.sign(payload, secretKey, {
      expiresIn: 3 * 60 * 60,
    });
  return token;
};

// 验证token
var verifyToken = function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      console.log("verify error", err);
      return res.json({ code: "404", msg: "token无效" });
    }
    console.log("verify decoded", decoded);
    req.decoded = decoded;
    next();
  });
};

module.exports = {
  generateToken,
  verifyToken,
};


// const express = require('express');

// const app = express();

// // Middleware to check if the user is authorized
// const authorize = (req, res, next) => {
//   // Check if the user is authenticated
//   const isAuthenticated = /* Your authentication logic here */;

//   if (isAuthenticated) {
//     // User is authorized, proceed to the next middleware or route handler
//     next();
//   } else {
//     // User is not authorized, send a 401 Unauthorized response
//     res.status(401).send('Unauthorized');
//   }
// };

// // Protected route that requires authorization
// app.get('/protected', authorize, (req, res) => {
//   res.send('You have access to the protected resource');
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });