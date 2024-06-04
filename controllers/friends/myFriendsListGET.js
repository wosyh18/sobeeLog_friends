const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const userListGET = require("../../users/userListGET");
const { friendsDB } = require("../../models");


module.exports = async(req, res) => {
    try{
        const {userid} = req.params;

        if(!userid){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NEED_LOGIN));
        }

        const userInfo = await userListGET(userid);
        const nickname = userInfo.nickname;

        //freind.js 중 getMyFriendsList에서 user2id랑 friendid 받아오기
        const friendsList = await friendsDB.getMyFriendsList(userid);

        //하나의 리스트로 만들고
        const data = {
            nickname: nickname, // 닉네임 추가
            friendsList: friendsList // 친구 목록 추가(userid, friendid)
        };

        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_FRIENDS_LIST_SUCCESS, data));
        
    }
    catch(err){
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
}

