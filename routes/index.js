var express = require('express');
var router = express.Router();

const main = require('../client');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/grpc', async function(req, res, next) {
  result = await main(req.body.address)
  res.send(result)
});

module.exports = router;
