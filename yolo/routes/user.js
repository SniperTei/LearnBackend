var express = require('express');
var router = express.Router();

// login
router.get('/login', (req, res) => {
  res.json({ code: '000000', msg: 'success0'});
});
// register

module.exports = router;
