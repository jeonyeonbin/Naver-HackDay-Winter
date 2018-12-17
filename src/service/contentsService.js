    /* contents API Server Library */
    const contentsAPI = require('../lib/contentsAPI')

    /* contents Dao */
    const contentsDao = require('../dao/contentsDao')

    const { numOfRecommend, numOfContents, refreshTime, deleteTime } = require('../lib/serviceData')

    module.exports = {
        /* 초기 데이터 불러오기 */
        findFirstContents,

        /* 과거 데이터 불러오기 */
        findPastContents,

        /* 최신 데이터 불러오기 */
        findNewContents
    }

    async function findFirstContents(userId, lastRenewal) {
        /* redis key */
        /* 먼저 데이터를 리스트 데이터에 저장해놓은다 */
        const listKey = 'user:' + userId + ':list'

        /* 중복 확인용 키값 */
        const key = 'user:' + userId + ':content'

        /* 최신글 N개 가져오기 */
        let contents = await contentsDao.getContentsByRange(key, -1 - numOfContents, -1)

        /* 갱신 주기 */
        const timeDifference = (new Date).getTime() - lastRenewal

        /* Redis에 Data가 없는 경우 */
        if(contents.length == 0){
            /* 추천 데이터 저장 */
            lastRenewal = await contentsAPI.getRecommend(listKey)
            
            /* contents 먼저 초기화 */
            contents = [];
            /* 리스트에서 데이터 불러오기 10개 */
            for(let i =0; i<10; i++){
                let lpopData = await contentsDao.lpopContent(listKey);
                lpopData = JSON.parse(lpopData);
                contents.push(lpopData);

                /* 데이터를 비동기적으로 sortedSet에 저장(?) */
                contentsDao.addContents(key,lpopData.writing_time.toString(),JSON.stringify(lpopData));
            }
        }

        result = {
            contents,
            lastRenewal
        }

        return result

    }

    async function findPastContents(userId, lastRenewal) {

        /* 먼저 데이터를 리스트 데이터에 저장해놓은다 */
        const listKey = 'user:' + userId + ':list'

        /* 중복 확인용 키값 */
        const key = 'user:' + userId + ':content'

        /* 갱신 주기 */
        const timeDifference = (new Date).getTime() - lastRenewal

        /* 리스트 길이 */
        const listLength = await contentsDao.getListLength(listKey);

        /* 과거글 N개 가져오기 */
        let contents = [];

        /* API 데이터를 가져와야댈때 */
        if(timeDifference > refreshTime){
            /* 추천 데이터 가져오기 */
            lastRenewal = await contentsAPI.getRecommend(listKey)
            
            /* 가장 과거 데이터의 시간 */
            const recent_writing_time = await getDataRecentOrPast(key,0,0);
            
            /* 데이터 전체 조회 */
            const moreRecentData = await contentsDao.getListByRange(listKey,0,80);
            
            contents = await getPastData(listKey,moreRecentData,recent_writing_time);


            /* 사용자가 본 데이터 저장 */
            addToSortedSet(contents,key);

            const contentsLength = contents.length;
            for(var i=0; i<contentsLength; i++){
                contents[i] = JSON.parse(contents[i])
            } 
            
        }
        /* 리스트에 데이터가 남아있을때 */
        else if(listLength != 0){

            /* 가장 과거 데이터의 시간 */
            const recent_writing_time = await getDataRecentOrPast(key,0,0);


            /* 가장 과거 데이터보다 더 과거인 데이터만 가져오기 */
            const moreRecentData = await contentsDao.getListByRange(listKey,0,80);

            contents = await getPastData(listKey,moreRecentData,recent_writing_time);
            
            /* 사용자가 본 데이터 저장 */
            addToSortedSet(contents,key);
            
            const contentsLength = contents.length;
            for(var i=0; i<contentsLength; i++){
                contents[i] = JSON.parse(contents[i])
            } 
            
        }
        /* 결과 값 */
        result = {
            contents,
            lastRenewal
        }

        return result
    }

    /**
     * 
     * @param {userID} userId 
     * @param {최근 갱신 시각} lastRenewal 
     */
    async function findNewContents(userId, lastRenewal) {

        /* 먼저 데이터를 리스트 데이터에 저장해놓은다 */
        const listKey = 'user:' + userId + ':list'

        /* 중복 확인용 키값 */
        const key = 'user:' + userId + ':content'

        /* 갱신 주기 */
        const timeDifference = (new Date).getTime() - lastRenewal

        /* 리스트 길이 */
        const listLength = await contentsDao.getListLength(listKey);

        /* 최신글 N개 가져오기 */
        let contents = [];

        /* 데이터를 가져와야댈때 */
        if(timeDifference > refreshTime){
            /* 추천 데이터 가져오기 */
            lastRenewal = await contentsAPI.getRecommend(listKey)

            /* 가장 최신 데이터의 시간 */
            const recent_writing_time = await getDataRecentOrPast(key,-1,-1);

            /* 가장 최신 데이터보다 더최신인 데이터만 가져오기 */
            const moreRecentData = await contentsDao.getListByRange(listKey,0,80);
            
            /* 리스트에서 최근데이터보다 더최근인 데이터를 가져와서 리턴해줌 */
            contents = await getNewData(listKey,moreRecentData,recent_writing_time);

            /* 사용자가 본 데이터 저장 */
            addToSortedSet(contents,key);
            
            const contentsLength = contents.length;
            for(var i=0; i<contentsLength; i++){
                contents[i] = JSON.parse(contents[i])
            }


        
    }
    /* 리스트에 데이터가 남아있을때 */
    else if(listLength != 0){

        /* 가장 최신 데이터의 시간 */
        const recent_writing_time = await getDataRecentOrPast(key,-1,-1);


        /* 가장 최신 데이터보다 더최신인 데이터만 가져오기 */
        const moreRecentData = await contentsDao.getListByRange(listKey,0,80);

        /* 리스트에서 최근데이터보다 더최근인 데이터를 가져와서 리턴해줌 */
        contents = await getNewData(listKey,moreRecentData,recent_writing_time);
        
        /* 사용자가 본 데이터 저장 */
        addToSortedSet(contents,key);

        const contentsLength = contents.length;
        for(var i=0; i<contentsLength; i++){
            contents[i] = JSON.parse(contents[i])
        }
    }


        /* 결과 값 */
        result = {
            contents,
            lastRenewal
        }

        return result
    }

    /***********************
     *  공통으로 사용하는 함수
     **********************/
    /**
     * @param range의 스타트, range의 end
     * @desc 사용자가 본 데이터 중 가장 최신 데이터의 날짜 or 가장 오래된 데이터의 날짜
     */
    async function getDataRecentOrPast(key,start,end){

        /* 가장 최신 (-1,-1)데이터 
            가장 과거 데이터 (0,0) 데이터 */
        const recentData = await contentsDao.getContentsByRange(key,start,end);
        return recent_writing_time = recentData[0].writing_time;
    }

    /**
     * 
     * @param {사용자가 본 데이터} contents
     * @desc 사용자가 본데이터들 sortedset에 저장 
     */
    function addToSortedSet(contents,key){
        for(e of contents){
            e = JSON.parse(e);
            /* 데이터를 비동기적으로 sortedSet에 저장(?) */
            contentsDao.addContents(key,e.writing_time.toString(),JSON.stringify(e));
        }
    }

    /**
     * 
     * @param {더보기 데이터 } moreRecentData
     * @desc 리스트에서 최근데이터보다 더최근인 데이터를 가져와서 리턴해줌 
     */
    async function getNewData(listKey,moreRecentData,recent_writing_time){
        let contents =[];
        
        const moreRecentDataLength = moreRecentData.length-1;
        if(moreRecentDataLength == 0) return contents;
        
        /* 최신 데이터 가져오기 */
        for(let i = moreRecentDataLength; i> 0; i--){
            moreRecentData[i] = JSON.parse(moreRecentData[i]);
            if(moreRecentData[i].writing_time > recent_writing_time){
                let startIdx;
                startIdx = i-10;

                if(i < 10 ) startIdx = 0; 
                contents = await contentsDao.getListByRange(listKey,startIdx,i);
                break;
            }
        }
        return contents;
    }

    /**
     * 
     * @param {리스트 키} listKey 
     * @param {가장 오래된 데이터 시간} recent_writing_time 
     * @param {리스트에 있는 데이터} moreRecentData
     * @desc 가장 오래된 데이터 가져오기
     */
    async function getPastData(listKey,moreRecentData,recent_writing_time){

        /* 사용자가 볼 데이터 */
        let contents = [];

        const moreRecentDataLength = moreRecentData.length-1;
        if(moreRecentDataLength == 0) {
            return contents;
        }

        for(let i = 0; i< moreRecentDataLength; i++){
            moreRecentData[i] = JSON.parse(moreRecentData[i])
            if(moreRecentData[i].writing_time < recent_writing_time){
                contents = await contentsDao.getListByRange(listKey,i,i+10);
                break;
            }
        }
        return contents;
    }