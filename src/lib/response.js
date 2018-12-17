const moment = require('moment');
const { successlogger, errorLogger } = require('../lib/winston')

module.exports = {
  /* Data 응답 */
  respondJson,

  /* Error일 경우 응답 */
  respondOnError
}

function respondJson(message, obj, res, status, reqInfo) {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  // res.setHeader('Access-Control-Allow-Credentials', true);
  //console.log(res)
  res
    .status(status)
    .json({
      message,
      data: (obj) ? obj : {}
    });

  const logData = {
    "time": moment().format('MMMM DD YYYY, h:mm:ss a'),
    "message": message,
    "status": status,
    "pathname": reqInfo['pathname'],
    "responseTime": `${(new Date()) - reqInfo['startTime']}ms`
  }

  //console.log(`${moment().format('MMMM DD YYYY, h:mm:ss a')} => message : ${message} / status : ${status}`)
  //console.log(log)
  successlogger.info(logData)
}

function respondOnError(message, res, status, error, reqInfo) {
  res
    .status(status)
    .json({
      message
    });

  const logData = {
    "time": moment().format('MMMM DD YYYY, h:mm:ss a'),
    "message": message,
    "status": status,
    "pathname": reqInfo['pathname'],
    "responseTime": `${(new Date()) - reqInfo['startTime']}ms`,
    "error" : error.stack.toString()
  }
  
  //console.log(`${moment().format('MMMM DD YYYY, h:mm:ss a')} => message : ${message} / status : ${status}`)
  console.log(error)
  //console.log(error.stack)
  errorLogger.error(logData)
}

