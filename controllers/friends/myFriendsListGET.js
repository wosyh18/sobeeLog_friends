const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const userListGET = require("../../users/userListGET")
const { friendsDB } = require("../../models");
const userListGET = require("../users/userListGET");

module.exports = async(req, res) => {
    try{
        const {userid} = req.params;

        if(!userid){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NEED_LOGIN));
        }
        //user와의 통신을 통해 nickname 받아오기 (userListGET에서)
        const userInfoList= await userListGET(userid);
        //freind.js 중 getMyFriendsList에서 user2id랑 friendid 받아오기
        
        //하나의 리스트로 만들고

        //반환
        const data = {
            friendsList: friendsList,
        }


        // //INFO: 현재 로그인된 사용자의 친구 리스트 반환
        // const result = await friendsDB.getMyFriendsList(userid);
        // const friendsList = result.map((friend) => {
        //     return friend;
        //   });

        // const data = {
        //     friendsList: friendsList,
        // }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_FRIENDS_LIST_SUCCESS, data));
        
    }
    catch(err){
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
}

