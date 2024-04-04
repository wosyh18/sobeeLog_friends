const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const checkValidUser = require("./checkValidUser");
const { friendsDB } = require("../../models");

module.exports = async(req, res) => {
    const {receiverID, senderID} = req.body;

    try{
        if(!receiverID || !senderID){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.OUT_OF_VALUE));
        }

        //INFO: 유효한 사용자인지 검사
        const isValidReceiver = await checkValidUser(receiverID);
        const isValidSender = await checkValidUser(senderID);
        if(!isValidReceiver || !isValidSender){
            return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.NO_USER));
        }

        const result = await friendsDB.patchFriendRequest(receiverID, senderID);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.UPDATE_FRIEND_SUCCESS));

    } catch(err){
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
}