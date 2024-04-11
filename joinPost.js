const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const { userDB } = require("../../models");
const passport = require('../../passport.js');

module.exports = async (req, res) => {
    const { userID, password } = req.body;

try {
      await userDB.postjoin(userID, password);
      console.log(responseMessage.CREATED_USER, 'User ID:', userID);
      res.status(statusCode.CREATED).send(responseMessage.CREATED_USER);
} catch (error) {
      console.error( esponseMessage.CREATED_USER_FAIL, error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(responseMessage.INTERNAL_SERVER_ERROR);
}};