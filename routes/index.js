var express = require('express');
const { Config } = require('../config/Config.js')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: `api.${Config.defaults.target}` });
});

module.exports = router;
