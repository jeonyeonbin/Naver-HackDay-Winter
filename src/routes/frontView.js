var express = require('express');
var router = express.Router();

/**
 * @param req res
 * @desc 테스트 페이지 보여주기
 */
router.get('/', function(req, res){
    res.render('test');
})

module.exports = router;