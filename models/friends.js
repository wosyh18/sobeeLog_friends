const {db} = require("./db");

/* 통신이 필요한 부분 = getMyfriendList, getNicknamedUserList,  getReceivedFriendRequestsLis, checkValidUser
  */

//myFriendsListGET
const getMyFriendsList = async (userId) => { 
    //주어지는 userId가 user1id라고 보고, 그에 맞는 User2id와 friendid 받아오기.
    let sql = `
        SELECT f.friendID AS friendID, f.user2ID AS friendUserID
        FROM friend f
        WHERE f.user1ID= ? AND f.accepted = 1;
    `;
    let [rows, fields] = await db.execute(sql, [userId]);
    console.log(rows);
    return rows;
}

// const getNicknamedUserList = async(userid, nickname) => {
//     let keyword = '%' + nickname + '%';

    //user에 통신 보낼 때 nickname을 담아서 보내주면, user에서 해당하는 nickname을 다줘.
    //요청 받는게 userid랑 nickname 구조체로 결과가 들어오면 -> 들어오는 결과 저장할 배열 변수 선언하고 [userid, nickname] 이렇게 들어오겠지.
    // 친구 신청할 때 -> 닉네임을 보내면, 그거에 맞는 userid가 돌아오는데, 
    // nickname이 아예 존재하지 않으면 빈 배열로 오고, 친구가 이미 되어있으면(본인 id와 검색한 userid에 friendid가 있는지 = getFriendIDs) 화면에 보이지 않게, 즉 존재하지 않거나 이미 친구면 화면에 보이면 안됨.
    //존재하는데 나랑 친구가 안되어 있으면(friendid가 테이블에 없으면) -> 화면에 보이게 

    // 리스트로 들어오니까 배열로 만들어서, 배열 for문 돌면서 친구가 이미 되어있으면 
    // 그 다음에 나랑 친구가 이미 되어있는 아이는 화면에 보이지 않게 처리해서 검색 리스트에 나오게 구현시켜

//     //findUserListGet
//     const getNicknamedUserList = async(userid, nickname) => {
//         //friendid가 접근이 돼, userid는 어떻게 넘겨 받을거야? 여기서? 
//         let keyword = '%' + nickname + '%';
//     let sql = `
//         SELECT u.user_id AS userID, u.nickname AS nickname
//         FROM cloudfriend.user u
//         WHERE u.nickname LIKE ? 
//         AND u.user_id NOT IN (SELECT f.user2_id FROM cloudfriend.friend f WHERE f.user1_id = ? OR f.user2_id = ?);
//     `;

//     let [rows] = await db.query(sql, [keyword, userid, userid]);
//     console.log(rows);
//     return rows;
// }

//앞 getNicknamedUserlist 대신 getUserIDInFriend 생성함. userid가 user1과 user2에 있는지 확인해야.
const getUserIDInFriend = async (user1ID, user2ID) => {
    let sql = `
        SELECT user1ID, user2ID
        FROM friend
        WHERE (user1ID = ? AND user2ID = ?)
           OR (user1ID = ? AND user2ID = ?);
    `;
    let [rows] = await db.query(sql, [user1ID, user2ID, user2ID, user1ID]);
    return rows;
};

//receivedFriendRequestsList
const getReceivedFriendRequestsList = async (userId) => {
    let sql = `
        SELECT friendID AS friendID, user1ID AS userID
        FROM friend
        WHERE user2ID = ? AND (accepted = 0 OR accepted = 2);
    `;

    let [rows] = await db.execute(sql, [userId]);
    console.log(rows);
    return rows;
}

//friendRequestPOST
const postFriendRequest = async (senderID, receiverID) => {
    let sql = `
        INSERT INTO friend (user1ID, user2ID, accepted) VALUES (?, ?, ?);
    `;
    
    let conn;
    try{
        conn = await db.getConnection();
        await conn.beginTransaction(); //트랜잭션 시작

        await conn.query(sql, [senderID, receiverID, 2]);
        await conn.query(sql, [receiverID, senderID, 0]);

        await conn.commit(); //트랜잭션 커밋

    }catch (err){
        await conn.rollback(); //트랜잭션 롤백
        throw err;

    }finally{
        if(conn) conn.release(); //커넥션 반환
    }
}
//friendRequestAcceptedPATCH
const patchFriendRequest = async (receiverID, senderID) => {
    let sql = `
        UPDATE friend
        SET accepted = 1
        WHERE user1Id = ? AND user2ID = ?;
    `;
    
    let conn;
    try {
        conn = await db.getConnection();
        await conn.beginTransaction(); // 트랜잭션 시작

        await conn.query(sql, [receiverID, senderID]);
        await conn.query(sql, [senderID, receiverID]);

        await conn.commit(); // 트랜잭션 커밋
    } catch (err) {
        await conn.rollback(); // 트랜잭션 롤백
        throw err;
    } finally {
        if (conn) conn.release(); // 커넥션 반환
    }
}

//friendDeletePOST
const deleteFriend = async(friendIDs) => {
    console.log(friendIDs);

    let sql = `
        DELETE FROM friend f
        WHERE f.friendID IN (?);
    `;
    
    let conn;
    try{
        conn = await db.getConnection();
        await conn.beginTransaction(); //트랜잭션 시작

        await conn.query(sql, [friendIDs]);

        await conn.commit(); //트랜잭션 커밋

    }catch (err){
        await conn.rollback(); //트랜잭션 롤백
        throw err;
    }finally{
        if(conn) conn.release(); //커넥션 반환
    }
}

// const checkValidUser = async (userid) => {
//     //user 서비스에 실제로 존재하는 user인지 확인해야함. -> user 서비스와의 통신 필요
//     let sql = `SELECT exists(SELECT 1 FROM user u WHERE u.user_id = ?) as result;`;
//     let [rows] = await db.execute(sql, [userid]);
//     const result = rows[0].result === 1;
//     return result;
// }

//friendRequestPOST & friendDeletePOST
const getFriendIDs = async (user1ID, user2ID) => {
    let sql = `
        SELECT f.friendID
        FROM friend f
        WHERE (f.user1ID = ? AND f.user2ID = ?)
        OR (f.user1ID = ? AND f.user2ID = ?);
    `;
    let [rows] = await db.execute(sql, [user1ID, user2ID, user2ID, user1ID]);
    //console.log(rows);

    const friendIDs = rows.map(row => row.friendID);
    return friendIDs;
}

module.exports = {
    getMyFriendsList,
    getUserIDInFriend,
    getReceivedFriendRequestsList,
    postFriendRequest,
    patchFriendRequest,
    deleteFriend,
    getFriendIDs,
}