const { friendsDB } = require("../../models");

module.exports = async(userid) => {
    try{
        //INFO: 주어진 사용자의 존재 여부 확인
        const result = await friendsDB.checkValidUser(userid);
        if(result){
            console.log("[checkValidUser = " + userid + " ]: TRUE");
            return true;
        }
        else{
            console.log("[checkValidUser = " + userid + " ]: FALSE");
            return false;
        }
    } catch(err){
        console.log(err);
    }
}