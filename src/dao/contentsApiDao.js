/* redis */
const redis = require('redis');
const client = redis.createClient();

/* util */
const util = require('util');

module.exports = {
    /* api 호출 수 가져오기 */
    getNumOfApiCall,

    /* api 호출 수 set */
    setNumOfApiCall
}

async function getNumOfApiCall (key) {
    const get = util.promisify(client.get).bind(client)

    const result = await get(key)

    return result
}

async function setNumOfApiCall (key, value) {
    const set = util.promisify(client.set).bind(client)

    const result = await set(key, value)

    return result
}