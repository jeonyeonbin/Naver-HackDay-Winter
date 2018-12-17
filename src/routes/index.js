var express = require('express');
var router = express.Router();

const contents = require('./contents')

/* view 용 라우터 */
const front = require('./frontView');

const feedUI = require('./feedUI')

/* contents router */
router.use('/contents', contents)

/* 보여지기용 router */
router.use('/front',front);
/* feed ui */
router.use('/feedUI', feedUI)

module.exports = router;
