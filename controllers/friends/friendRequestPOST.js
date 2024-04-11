const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const checkValidUser = require("./checkValidUser");
const getFriendIDs = require("./getFriendIDs");
const { friendsDB } = require("../../models");

module.exports = async(req, res) => {
    const {senderID, receiverID} = req.body;

    try{
        if(!senderID || !receiverID){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.OUT_OF_VALUE));
        }

        //INFO: 유효한 사용자인지 검사
        const isValidSender = await checkValidUser(senderID);
        const isValidReceiver = await checkValidUser(receiverID);
        if(!isValidSender || !isValidReceiver){
            return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.NO_USER));
        }

        //INFO: 친구관계Id 찾기 -> 이미 존재하는 친구인지 확인
        const friendIDs = await getFriendIDs(senderID, receiverID);
        if(friendIDs.length != 0){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.FRIEND_EXIST));
        }

        const result = await friendsDB.postFriendRequest(senderID, receiverID);
        return res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, responseMessage.REQUEST_FRIEND_SUCCESS));

    } catch(err){
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
}