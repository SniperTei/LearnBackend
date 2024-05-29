var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // res.send('Hello World');
});

router.get('/hello', function(req, res) {
  // 打印req
  console.log(req);
  // res.send('Hello World');
  // res.send('Hello World');
  res.json({ message: 'Hello World' });
});

var cb0 = function (req, res, next) {
  console.log('CB0');
  next();
}

var cb1 = function (req, res, next) {
  console.log('CB1');
  next();
}

var cb2 = function (req, res) {
  res.send('Hello from C!');
}

router.get('/example/c', [cb0, cb1, cb2]);

module.exports = router;
