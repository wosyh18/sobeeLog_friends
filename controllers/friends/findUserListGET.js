const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const getUserID = require("../../users/getUserID");
const { friendsDB } = require("../../models");

//친구 이름 검색 : 전체 사용자에서 닉네임을 검색 -> 우리가 user 마이크로 서비스에 nickname 을 전송하면 그에 맞는 userid와 nickname이 반환.
// userid, nickname이 오면 friend db에 있는 userid인지(getFrinedID) 체크.

module.exports = async(req, res) => {
    try{
        //여기서 
        const userid = req.query.userid;
        const nickname = req.query.nickname;

        if(!nickname || !userid){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }


        //nickname을 쿼리로 담아서 user 마이크로 서비스에게 통신 요청 (-> getUserID에서 정의한 걸 사용) -> userInfo에서 리스트 형식으로 
        const userInfoList = await getUserID(nickname);
        //받은 userInfoList가 없거나 빈 배열로 주어지면
        if (!userInfoList ||  userInfoList.length === 0) {
            return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, responseMessage.NO_USER));
        }
        //받은 리스트에서 userID를 추출
        const userIDs = userInfoList.map(user => user.userID);  
        //추출한 userID가 내 frienddb에 user1id나 user2id에 존재하는지 검사하는 역할
        const userList = await getUserIDInFriend(userIDS);

        
        const data = {
            userList: userList,
        }



        // //INFO: 닉네임에 검색어가 포함된 사용자 리스트 반환
        // const result = await friendsDB.getNicknamedUserList(userid, nickname);
        // const userList = result.map((users) => {
        //     return users;
        //   });

        
        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_FIND_USERS_SUCCESS, data));
        
    }
    catch(err){
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
}