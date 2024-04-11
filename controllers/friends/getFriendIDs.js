const { friendsDB } = require("../../models");

module.exports = async(user1ID, user2ID) => {
    try{
        //INFO: 친구관계의 존재 여부 확인
        const result = await friendsDB.getFriendIDs(user1ID, user2ID);
        if(result){
            console.log("[getFriendIDs = " + result + " ]");
            return result;
        }
    } catch(err){
        console.log(err);
    }
}