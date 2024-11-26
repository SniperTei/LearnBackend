var express = require('express');
var router = express.Router();

// test
router.get('/', (req, res) => {
  res.json({ code: '666666', msg: 'test'});
});

module.exports = router;
