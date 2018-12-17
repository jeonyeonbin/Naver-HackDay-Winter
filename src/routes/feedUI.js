var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.render('feedUI.html')
})

module.exports = router