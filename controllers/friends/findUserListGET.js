const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const { friendsDB } = require("../../models");

module.exports = async(req, res) => {
    try{
        const userid = req.query.userid;
        const nickname = req.query.nickname;

        if(!nickname || !userid){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }

        //INFO: 닉네임에 검색어가 포함된 사용자 리스트 반환
        const result = await friendsDB.getNicknamedUserList(userid, nickname);
        const userList = result.map((users) => {
            return users;
          });

        const data = {
            userList: userList,
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_FIND_USERS_SUCCESS, data));
        
    }
    catch(err){
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
}