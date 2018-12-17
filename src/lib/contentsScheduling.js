const contenstDao = require('../dao/contentsDao')

const contentsAPI = require('../lib/contentsAPI')

const { numOfRecommend, numOfContents, refreshTime, deleteTime } = require('../lib/serviceData')

/* 작성 된지 특정 시간이 지난 데이터 삭제 */
async function deleteContentsScheduling() {
    const keys = await contenstDao.getAllKeys()

    const score = ((new Date()).getTime() - deleteTime) / 1000

    for (var i = 0; i < keys.length; i++) {
        /* api 호출 개수 제외 */
        if(keys[i] == 'numOfApiCall'){
            continue
        }

        contenstDao.deleteContents(keys[i], '-inf', score)
    }
}

/* 비회원 데이터 스케줄링 */
async function addContentsScheduling() {
    contentsAPI.getRecommend('user:default:contents')
}

/* 30분 마다 실행 */
setInterval(deleteContentsScheduling, 1800000);

/* 30분 마다 실행 */
setInterval(addContentsScheduling, 1800000);