const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const { friendsDB } = require("../../models");

module.exports = async(req, res) => {
    try{
        const {userid} = req.params;

        if(!userid){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NEED_LOGIN));
        }

        //INFO: 현재 로그인된 사용자의 친구 리스트 반환
        const result = await friendsDB.getMyFriendsList(userid);
        const friendsList = result.map((friend) => {
            return friend;
          });

        const data = {
            friendsList: friendsList,
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_FRIENDS_LIST_SUCCESS, data));
        
    }
    catch(err){
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
}