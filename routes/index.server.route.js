var express = require('express');
var router = express.Router();
var indexController = require('../controllers/index.server.controller');

/* GET home page. */
router.get('/', indexController.serveIndex);

module.exports = router;