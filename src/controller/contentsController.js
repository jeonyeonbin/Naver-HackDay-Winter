const { respondJson, respondOnError } = require('../lib/response')

const contentsService = require('../service/contentsService')

module.exports = {
    /* 초기 데이터 불러오기 */
    getFirstContents,

    /* 과거 데이터 불러오기 */
    getPastContents,

    /* 최신 데이터 블로오기 */
    getNewContents
}

async function getFirstContents(req, res) {

    const reqInfo = {
        /* 요청 URI */
        "pathname": `${req.method} ${req._parsedOriginalUrl.pathname}`,
        /* 요청 시작 시간 */
        "startTime": new Date()
    }

    try {
        /* userId */
        let userId = (req.params.userId == undefined) ? 'global' : req.params.userId

        /* coockie 저장 */
        let contentsInfo = (req.cookies.contentsInfo != undefined) ? req.cookies.contentsInfo : {}
        
        /* 마지막 갱신 시간 */
        const lastRenewal = (Object.getOwnPropertyNames(contentsInfo).length == 0) ? 0 : req.cookies.contentsInfo['lastRenewal']

        /* Service 호출 */
        const result = await contentsService.findFirstContents(userId, lastRenewal)

        /* set cookie */
        contentsInfo = {
            'pastContent': result.contents[0],
            'newContent': result.contents[result.contents.length - 1],
            'lastRenewal': result.lastRenewal
        }

        res.cookie('contentsInfo', contentsInfo, {
            maxAge: 1000000
        })

        /* Response */
        respondJson("Success", result.contents, res, 200, reqInfo);
    }
    catch (error) {
        respondOnError('Internal Server Error', res, 500, error, reqInfo);
    }

    return null;

}

async function getPastContents(req, res) {

    const reqInfo = {
        /* 요청 URI */
        "pathname": `${req.method} ${req._parsedOriginalUrl.pathname}`,
        /* 요청 시작 시간 */
        "startTime": new Date()
    }


    try{
        /* userId */
        let userId = (req.params.userId == undefined) ? 'global' : req.params.userId

        /* coockie 저장 */
        let contentsInfo = (req.cookies.contentsInfo != undefined) ? req.cookies.contentsInfo : {}

        /* 마지막 갱신 시간 */
        const lastRenewal = (Object.getOwnPropertyNames(contentsInfo).length == 0) ? 0 : req.cookies.contentsInfo['lastRenewal']


        /* Service 호출 */
        const result = await contentsService.findPastContents(userId,lastRenewal);

        /* set cookie */
        contentsInfo = {
            'lastRenewal': result.lastRenewal
        }

        res.cookie('contentsInfo', contentsInfo, {
            maxAge: 1000000
        })

        /* Response */
        respondJson("Success", result.contents, res, 200, reqInfo);
    }catch(error){
        respondOnError('Internal Server Error', res, 500, error, reqInfo);
    }    
    return null;
}

async function getNewContents(req, res) {

    const reqInfo = {
        /* 요청 URI */
        "pathname": `${req.method} ${req._parsedOriginalUrl.pathname}`,
        /* 요청 시작 시간 */
        "startTime": new Date()
    }
    
    try{
        /* userId */
        let userId = (req.params.userId == undefined) ? 'global' : req.params.userId

        /* coockie 저장 */
        let contentsInfo = (req.cookies.contentsInfo != undefined) ? req.cookies.contentsInfo : {}

        /* 마지막 갱신 시간 */
        const lastRenewal = (Object.getOwnPropertyNames(contentsInfo).length == 0) ? 0 : req.cookies.contentsInfo['lastRenewal']


        /* Service 호출 */
        const result = await contentsService.findNewContents(userId,lastRenewal);

        /* set cookie */
        contentsInfo = {
            'lastRenewal': result.lastRenewal
        }

        res.cookie('contentsInfo', contentsInfo, {
            maxAge: 1000000
        })

        /* Response */
        respondJson("Success", result.contents, res, 200, reqInfo);
    }catch(error){
        respondOnError('Internal Server Error', res, 500, error, reqInfo);
    }    
    return null;
}