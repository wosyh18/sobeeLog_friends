const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const userListGET = require("../users/userListGET");
const { friendsDB } = require("../../models");

/*
1. userid 받아온 거를 friendsDB.getMyFriendsList(userid)로 담아서 넘겨준다.
 */


module.exports = async(req, res) => {
    try{
        const {userid} = req.params;

        if(!userid){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NEED_LOGIN));
        }

        //freind.js 중 getMyFriendsList에서 user2id랑 friendid 받아오기
        const friendsList = await friendsDB.getMyFriendsList(userid);
        console.log("ff: ", friendsList);

    
        for (const friend of friendsList) {
            const userInfo = await userListGET(friend.friendUserID); // friendUserID를 가져옴
            // console.log("User info: ", userInfo);
            friend.nickname = userInfo.nickname;
        }



        //하나의 리스트로 만들고
        const data = {
            friendsList: friendsList // 친구 목록 추가(userid, friendid)
        };

        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_FRIENDS_LIST_SUCCESS, data));
        
    }
    catch(err){
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
}

