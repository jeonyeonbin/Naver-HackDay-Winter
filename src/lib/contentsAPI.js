const request = require('request-promise')
const moment = require('moment')

/* contents Dao */
const contentsDao = require('../dao/contentsDao')

/* contents API Dao */
const contentsApiDao = require('../dao/contentsApiDao')

const { apiLogger } = require('../lib/winston')

const { numOfRecommend, numOfContents, refreshTime, deleteTime } = require('../lib/serviceData')

module.exports = {
    /* 추천데이터 불러오기 */
    getRecommend
}


/**
 * 
 * @param {더미 데이터 저장용 키} key
 *  
 */
async function getRecommend(key) {
    console.log('api server call !')

    /* URI */
    const option = {
        method: 'GET',
        uri: 'http://125.209.209.109/api_hackday?st=rec&display=' + numOfRecommend+'&userid=4KIM1',
        json: true
    }

    console.log('getCommand1');
    /* Contents API Server 호출 */
    const apiResult = await request(option);

    /* 응답에서 추천 데이터 추출 */
    const recommend = apiResult.result.recommend;


    
    /* 추천 데이터 먼저정렬 */
    const recommendDataList = await recommend.sort(sortByDtSvc);

    const recommendDataLength  = recommendDataList.length;  // 추천 데이터 길이

    /* 데이터 리스트에 넣어주기 */
    for (var i = 0; i < recommendDataLength; i++) {
        /* score 생성 : 작성 시간을 seconds로 변환 */
        

        /* data 생성 */
        var data = {
            "title": recommendDataList[i].title,
            "image": recommendDataList[i].image,
            "office_name": recommendDataList[i].office_name,
            "writing_time": regexOnlyNumber(recommendDataList[i].dt_svc),
            "url": recommendDataList[i].url,
        }
        console.log(data.writing_time);
        // if(i > 0){
        //     if(recommendDataList[i].writing_time > recommendDataList[i-1].writing_time){
        //         console.log('정렬 실패');
        //     }else{
        //         console.log('정렬 성공');
        //     }
        // }
        //console.log('i :',i,"data:" , data);

        /* 
         Redis에 contents 저장 

         Key : user:userId:dummy
         Member : Contents Data
        */
        await contentsDao.pushContentToLeft(key, JSON.stringify(data));
       
    }



    /* API 호출 수 조회 */
    let numOfApiCall = await contentsApiDao.getNumOfApiCall('numOfApiCall')
    numOfApiCall = (numOfApiCall == null) ? 1 : ++numOfApiCall

    /* API 호출 수 set */
    await contentsApiDao.setNumOfApiCall('numOfApiCall', numOfApiCall)

    /* log */
    const logData = {
        "time": moment().format('MMMM DD YYYY, h:mm:ss a'),
        "numOfApiCall": numOfApiCall,
        "message" : "API log"
    }

    apiLogger.api(logData)


    /* 현재 시간 (마지막 갱신시간) 반환 */
    return (new Date()).getTime()
}

/**
 * 
 * @param {list} list 
 * @desc 시간별 정렬 
 */
let sortList = async (list) =>{
    return new Promise((resolve,reject) =>{
        list.sort(sortByDtSvc);
        resolve(list);
    });
}


/**
 * @desc dtsvc기준 오름차순 정렬
 * @param {object} a 
 * @param {object} b 
 */
function sortByDtSvc(a,b){
    a.dt_svc = regexOnlyNumber(a.dt_svc);
    b.dt_svc = regexOnlyNumber(b.dt_svc);
    return a.dt_svc < b.dt_svc ? -1 : a.dt_svc > b.dt_svc ? 1 : 0;
}


/**
 * @desc 레디스에서는 특수문자를 직접 넣으면 포맷이 맞지않아 숫자만 넣어줘야댐
 * @param {날짜} date 
 */
function regexOnlyNumber(date) {
    date.replace(/ /gi, '');
    res = date.replace(/[^0-9]/g, "");
    return res;
}