/* redis */
const redis = require('redis');
const client = redis.createClient();

/* util */
const util = require('util');

module.exports = {
    // Sorted Set Function

    /* Redis에 Contents 저장 */
    addContents,

    /* Contents Index(Rank) 추출 */
    getIndex,

    /* range로 Contents 추출 */
    getContentsByRange,

    /* 모든 Key 추출 */
    getAllKeys,

    /* score를 이용한 Contents 삭제 */
    deleteContents,



    // List Function
    
    /* 리스트 왼쪽에 Push */
    pushContentToLeft,

    /* 리스트에서 lpop */
    lpopContent,

    /* 리스트에서 rpop */
    rpopContent,

    /* 리스트 길이 */
    getListLength,

    /* 리스트 데이터 리셋 */
    listReset,

    /* list range 로 가져오기 */
    getListByRange
}

async function addContents(key, score, member) {
    console.log(`zdd : ${key}`)
    const zadd = util.promisify(client.zadd).bind(client)

    await zadd(key, score, member)
}

async function getIndex(key, member) {
    console.log(`zrank : ${key}`)

    const zrank = util.promisify(client.zrank).bind(client)

    /* index(rank) 가져오기 */
    const result = await zrank(key, member)

    return result
}

async function getContentsByRange(key, begin, end) {
    console.log(`zrange : ${key}`)

    const zrange = util.promisify(client.zrange).bind(client)

    /* range로 contents 가져오기 */
    const result = await zrange(key, begin, end)

    for (var i = 0; i < result.length; i++) {
        result[i] = JSON.parse(result[i])
    }

    return result
}

async function getAllKeys() {
    console.log(`keys : ${key}`)

    const keys = util.promisify(client.keys).bind(client)

    /* 모든 key 가져오기 */
    const result = await keys('*')

    return result
}

async function deleteContents(key, minScore, maxScore) {
    console.log(`zremrangebyscore : ${key}`)

    const zremrangebyscore = util.promisify(client.zremrangebyscore).bind(client)

    /* 해당 범위 contents 제거 */
    await zremrangebyscore(key, minScore, maxScore)
}

async function pushContentToLeft(key, value) {
    console.log(`lpush : ${key}`)

    const lpush = util.promisify(client.lpush).bind(client)

    /* 리스트 왼쪽에 Push */
    await lpush(key, value)
}

/**
 * @param {키 값} key 
 * @desc 신규 데이터 가져오기
 */
async function lpopContent(key) {
    console.log(`lpop : ${key}`)

    const lpop = util.promisify(client.lpop).bind(client)

    /* 리스트에서 lpop */
    const result = await lpop(key)

    return result
}

/**
 * @param {키 값} key
 * @desc 과거데이터 가져오기 
 */
async function rpopContent(key) {
    console.log(`rpop : ${key}`)

    const rpop = util.promisify(client.rpop).bind(client)

    /* 리스트에서 rpop */
    const result = await rpop(key)

    return result
}

async function getListLength(key) {
    console.log(`llen : ${key}`)

    const llen = util.promisify(client.llen).bind(client)

    /* 리스트 길이 추출 */
    const result = await llen(key)

    return result
}

async function getListByRange(key,start,end) {
    console.log(`lrange : ${key}`)

    const lrange = util.promisify(client.lrange).bind(client)

    /* 리스트 길이 추출 */
    const result = await lrange(key,start,end);

    return result
}

/**
 * @desc 리스트 데이터 리셋
 */
async function listReset(key){
    console.log(`expire : ${key}`)
   
    return client.expire(key,300);
}