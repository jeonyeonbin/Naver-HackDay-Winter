module.exports = {
    // 경과 시간 계산 함수
    checktime: function (writingTime) {

        let currentTime = new Date();
        var data;

        /* 작성 10분 이내 */
        if (currentTime.getTime() - writingTime.getTime() < 600000) {
            data = "방금 전";
        } /* 1시간 이내 */
        else if (currentTime.getTime() - writingTime.getTime() < 3600000) {
            data = Math.floor((currentTime.getTime() - writingTime.getTime()) / 60000) + "분 전";
        }/* 작성한지 24시간 초과 */
        else if (currentTime.getTime() - writingTime.getTime() > 86400000) {
            data = writingTime.getFullYear() + "년 " + (writingTime.getMonth() + 1) + "월 " + writingTime.getDate() + "일";
        } /* 24시간 이내 */
        else {
            if (currentTime.getDate() != writingTime.getDate()) {
                data = (24 - writingTime.getHours()) + (currentTime.getHours());
                if (data == 24) {
                    data = writingTime.getFullYear() + "년 " + (writingTime.getMonth() + 1) + "월 " + writingTime.getDate() + "일";
                }
                else {
                    data += "시간 전";
                }
            }
            else {
                data = (currentTime.getHours() - writingTime.getHours()) + "시간 전";
            }
        }

        return data;
    }
}
