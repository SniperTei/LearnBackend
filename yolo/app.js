var express = require('express');
// router
var testRoute = require('./routes/test');
var userRoute = require('./routes/user');

var app = express();
app.use('/api/v1/test', testRoute);
app.use('/api/v1/user', userRoute);

// app.get('/', function(req, res) {
//   res.send('Hello World1');
// });

app.listen(3000, function() {
  console.log('Server is running on port 3000');
});

module.exports = app;