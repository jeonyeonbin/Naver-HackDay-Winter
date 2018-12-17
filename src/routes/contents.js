const express = require('express')
const router = express.Router();

const contentsController = require('../controller/contentsController')

/* 
    초기 데이터 불러오기
    GET /contents
*/
router.get('/:userId', contentsController.getFirstContents)

/*
    과거 더 보기
    GET /contents/pastContents/:userId
*/
router.get('/pastContents/:userId', contentsController.getPastContents)

/* 
    최신 더 보기
    GET /contents/newContents/:userId
*/
router.get('/newContents/:userId', contentsController.getNewContents)

module.exports = router;
