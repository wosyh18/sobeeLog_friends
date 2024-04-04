const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const checkValidUser = require("./checkValidUser");
const getFriendIDs = require("./getFriendIDs");
const { friendsDB } = require("../../models");

module.exports = async(req, res) => {
    const {user1ID, user2ID} = req.body;

    try{
        if(!user1ID || !user2ID){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.OUT_OF_VALUE));
        }

        //INFO: 유효한 사용자인지 검사
        const isValidReceiver = await checkValidUser(user1ID);
        const isValidSender = await checkValidUser(user2ID);
        if(!isValidReceiver || !isValidSender){
            return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.NO_USER));
        }

        //INFO: 친구관계Id 찾기
        const friendIDs = await getFriendIDs(user1ID, user2ID);
        if(friendIDs.length == 0){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_FRIEND));
        }

        const result = await friendsDB.deleteFriend(friendIDs);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.DELETE_FRIEND_SUCCESS));

    } catch(err){
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
}