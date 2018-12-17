const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file');

module.exports = {
    /* 성공 시 Log */
    "successlogger": winston.createLogger({
        transports: [
            new DailyRotateFile({
                filename: './log/success/log',
                datePattern: 'YYYY-MM-DD',
                prepend: true,
                localTime: true,
                level: 'info'
            })
        ]
    }),
    /* error 발생 시 Log */
    "errorLogger": winston.createLogger({
        transports: [
            new DailyRotateFile({
                filename: './log/error/error-log',
                datePattern: 'YYYY-MM-DD',
                prepend: true,
                localTime: true,
                level: 'error'
            })
        ]
    }),
    /* API Server 호출 시 Log */
    "apiLogger": winston.createLogger({
        level: 'api',
        levels: { api:0 },
        transports: [
            new DailyRotateFile({
                filename: './log/api/api-log',
                datePattern: 'YYYY-MM-DD',
                prepend: true,
                localTime: true,
                level: 'api'
            })
        ]
    })
}