var express = require('express');
var router = express.Router();



router.use('/',function (req, res, next) {
    const onTime = new Date()
    console.log(onTime)
    next()
  })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    say: 'hi',
    no: 'no'
  })
});


router.post('/test', function(req, res, next) {
  console.log(req.body)
  res.json({
    result: req.body
  })
});

router.put('/testput', function(req, res, next) {
  console.log('hi, im put method')
  res.json({
    result: req.body
  })
});


router.delete('/testdel', function(req, res, next) {
  console.log('im delete method')
  console.log(req.body)
  res.json({
    result: req.body
  })
});


module.exports = router;
