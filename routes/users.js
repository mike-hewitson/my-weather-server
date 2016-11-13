var express = require('express');
var router = express.Router();

/* GET users listing. */
/* istanbul ignore next */

// Have not implemented users yet

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
