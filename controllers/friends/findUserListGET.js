const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const getUserID = require("../users/getUserID");
const { friendsDB } = require("../../models");

//친구 이름 검색 : 전체 사용자에서 닉네임을 검색 -> 우리가 user 마이크로 서비스에 nickname 을 전송하면 그에 맞는 userid와 nickname이 반환.
// userid, nickname이 오면 friend db에 있는 userid인지(getFrinedID) 체크.

module.exports = async(req, res) => {
    try{
        const { userId, nickname } = req.query;

        if(!userId || !nickname){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }
    
        //nickname을 쿼리로 담아서 user 마이크로 서비스에게 통신 요청 (-> getUserID에서 정의한 걸 사용) -> userInfo에서 리스트 형식으로 
        const userInfo = await getUserID(nickname); //nickname을 기반으로 userid 가져와
        console.log("userInfoResponse:", userInfo); // 로그 추가
        const userInfoList = userInfo.data.userList;
        
        //받은 userInfoList가 없거나 빈 배열로 주어지면
        if (!userInfoList ||  userInfoList.length === 0) {
            return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, responseMessage.NO_USER));
        }
        //받은 리스트에서 userID를 추출
        //추출한 userID가 내 frienddb에 user1id나 user2id에 존재하는지 검사하는 역할
        
        for (let i = 0; i < userInfoList.length; i++) {
            const userIDsearch = await friendsDB.getUserIDInFriend(userId, userInfoList[i].userId);
            console.log(`Checking userId ${userInfoList[i].userId} in friendsDB for userId ${userId}:`, userIDsearch);

            // userIDsearch가 존재하면 해당 userInfoList 요소를 제거
            if (userIDsearch && userIDsearch.length > 0) {
                userInfoList.splice(i, 1);
                i--; // 배열이 조정되었으므로 다음 인덱스를 다시 확인해야함
            }
        }

        const data = {
            userList: userInfoList
        };
        
        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_FIND_USERS_SUCCESS, data));
        
    }
    catch(err){
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
}