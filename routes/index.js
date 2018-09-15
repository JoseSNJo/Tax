var express = require('express');
var router = express.Router();
var taxes = require('./taxes');
var isAuthenticated = require('../middleware/auth_check');
router.use('/taxes', isAuthenticated, taxes);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({
    message: 'Welcome To Subdine Solutions Pvt Ltd',
    version: '1.0.1'
  });
});
module.exports = router;
