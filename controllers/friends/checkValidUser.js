const { friendsDB } = require("../../models");
const userListGET = require("../../users/userListGET");

module.exports = async(userid) => {
    try{
        //INFO: 주어진 사용자의 존재 여부 확인
        //const result = await friendsDB.checkValidUser(userid);

        const result = await userListGET(userid);
        for ( let user of result){
            if (user.userid === userid){
                console.log("[checkValidUser = " + userid + " ]: TRUE");
                return true;
            }
            else{
                console.log("[checkValidUser = " + userid + " ]: FALSE");
                return false;
            }
        }
        // if(result && result.length > 0){
        //     console.log("[checkValidUser = " + userid + " ]: TRUE");
        //     return true;
        // }
        // else{
        //     console.log("[checkValidUser = " + userid + " ]: FALSE");
        //     return false;
        // }
    } catch(err){
        console.log(err);
    }
}