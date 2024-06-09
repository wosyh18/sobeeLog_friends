const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const userListGET = require("../users/userListGET");
const checkValidUser = require("./checkValidUser");
const { friendsDB } = require("../../models");
/* 로직 설명

지금 nickname이 친구 요청을 한 nickname이 아니라 내 nickname이 반환돼. -> 수정 필요
param으로 들어온 userid에 대한 info가 아니라 friendList에 userid를 주고(그러면 이거는 user2ID(receiver가 되겠지)), 
거기에 맞는 user1id와 accepted가 0인 user2id를 userid로 가져와
그 후 userListGet(usesrid로 줘)

1. userid를 받아서 


*/

        

module.exports = async(req, res) => {
    try{
        const {userid} = req.params;
        if(!userid){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }
        const isValidUser = await checkValidUser(userid);
        if(!isValidUser){
            return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.NO_USER));
        }
        
        const friendsList = await friendsDB.getReceivedFriendRequestsList(userid);
        console.log("dddd", friendsList);
        // if (friendsList.length === 0) {
        //     return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_FRIEND_REQUESTS_SUCCESS, { friendsList }));
        // }

        for (const friend of friendsList) {
            console.log("userid", friend.userID);
            const userInfo = await userListGET(friend.userID); // friendUserID를 가져옴
            console.log("User info: ", userInfo);
            friend.nickname = userInfo.nickname;
        }
        

        const data = {
            friends: friendsList // 친구 목록 추가(userid, friendid)
        };

        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_FRIEND_REQUESTS_SUCCESS, data));
    }
    catch(err){
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
}

