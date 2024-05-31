const {db} = require("./db");
const fs = require("fs");
const http = require("http");
const userid = require("../controllers/friends/getUserID");

/* 통신이 필요한 부분 = getMyfriendList, getNicknamedUserList,getReceivedFriendRequestsLis, checkValidUser  */

const getMyFriendsList = async (userId) => {
    //user 서비스와의 통신이 필요하니까, user 서비스의 url을 통해 구현해야함. //이건 내 유저 id니까 통신을 통해서 가져올 필요가 없지. 
    //아 이때 query로 들어온 userid를 내 friend db에 저장하려는 부분 구현 필요. 

    // const friendRequests = rows.map(row => {
    //     const response = request('GET', `${userServiceUrl}/users/${row.userID}`);
    //     const { nickname } = JSON.parse(response.getBody('utf8'));
    //     return { ...row, nickname };
    // });

    let sql = `
        SELECT f.friend_id AS friendID, f.user2_id AS friendUserID, u.nickname 
        FROM friend f
        JOIN user u ON f.user2_id = u.user_id
        WHERE f.user1_id = ? AND f.accepted = 1;
    `;
    let [rows, fields] = await db.execute(sql, [userId]);
    console.log(rows);
    return rows;

    // console.log(friendsList);
    // return friendsList;
}

const getNicknamedUserList = async(userid, nickname) => {
    let keyword = '%' + nickname + '%';

    //user에 통신 보낼 때 nickname을 담아서 보내주면, user에서 해당하는 nickname을 다줘.
    //요청 받는게 userid랑 nickname 구조체로 결과가 들어오면 -> 들어오는 결과 저장할 배열 변수 선언하고 [userid, nickname] 이렇게 들어오겠지.
    // 친구 신청할 때 -> 닉네임을 보내면, 그거에 맞는 userid가 돌아오는데, 
    // nickname이 아예 존재하지 않으면 빈 배열로 오고, 친구가 이미 되어있으면(본인 id와 검색한 userid에 friendid가 있는지 = getFriendIDs) 화면에 보이지 않게, 즉 존재하지 않거나 이미 친구면 화면에 보이면 안됨.
    //존재하는데 나랑 친구가 안되어 있으면(friendid가 테이블에 없으면) -> 화면에 보이게 

    // 리스트로 들어오니까 배열로 만들어서, 배열 for문 돌면서 친구가 이미 되어있으면 
    // 그 다음에 나랑 친구가 이미 되어있는 아이는 화면에 보이지 않게 처리해서 검색 리스트에 나오게 구현시켜.


    let sql = `
        SELECT u.user_id AS userID, u.nickname AS nickname
        FROM cloudfriend.user u
        WHERE u.nickname LIKE ? 
        AND u.user_id NOT IN (SELECT f.user2_id FROM cloudfriend.friend f WHERE f.user1_id = ? OR f.user2_id = ?);
    `;

    let [rows] = await db.query(sql, [keyword, userid, userid]);
    console.log(rows);
    return rows;
}

const getReceivedFriendRequestsList = async (userId) => {
    let sql = `
        SELECT f.friend_id AS friendID, f.user2_id AS userID, u.nickname AS nickname
        FROM friend f
        JOIN user u
        ON f.user2_id = u.user_id
        WHERE f.user1_id = ? AND f.accepted = 0;
    `;

    // const friendRequests = rows.map(row => {
    //     const response = request('GET', `${userServiceUrl}/users/${row.userID}`);
    //     const { nickname } = JSON.parse(response.getBody('utf8'));
    //     return { ...row, nickname };
    // });

    let [rows] = await db.execute(sql, [userId]);
    console.log(rows);
    return rows;
    // console.log(friendRequests);
    // return friendRequests;
}

const postFriendRequest = async (senderID, receiverID) => {
    let sql = `
        INSERT INTO friend (user1_id, user2_id, accepted) VALUES (?, ?, ?);
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

const patchFriendRequest = async (receiverID, senderID) => {
    let sql = `
        UPDATE friend
        SET accepted = 1
        WHERE user1_id = ? AND user2_id = ?;
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

const checkValidUser = async (userid) => {
    //user 서비스에 실제로 존재하는 user인지 확인해야함.
    let sql = `SELECT exists(SELECT 1 FROM user u WHERE u.user_id = ?) as result;`;
    let [rows] = await db.execute(sql, [userid]);
    const result = rows[0].result === 1;
    return result;
}

const getFriendIDs = async (user1ID, user2ID) => {
    let sql = `
        SELECT f.friend_id
        FROM friend f
        WHERE f.user1_id = ? AND f.user2_id = ? 
        UNION
        SELECT f.friend_id
        FROM friend f
        WHERE f.user1_id = ? AND f.user2_id = ?;
    `;
    let [rows] = await db.execute(sql, [user1ID, user2ID, user2ID, user1ID]);
    //console.log(rows);

    const friendIDs = rows.map(row => row.friend_id);
    return friendIDs;
}

module.exports = {
    getMyFriendsList,
    getNicknamedUserList,
    getReceivedFriendRequestsList,
    postFriendRequest,
    patchFriendRequest,
    deleteFriend,
    checkValidUser,
    getFriendIDs,
}


// const axios = require('axios');
// const { db } = require('./db');
// const userServiceUrl = 'http://user-service-url'; // 사용자 서비스의 URL을 설정하세요

// const getMyFriendsList = async (userId) => {
//     let sql = `
//         SELECT f.friend_id AS friendID, f.user2_id AS friendUserID
//         FROM friend f
//         WHERE f.user1_id = ? AND f.accepted = 1;
//     `;
//     let [rows, fields] = await db.execute(sql, [userId]);

//     // 각 friendUserID에 대해 user 서비스에서 nickname을 가져옵니다.
//     const friendsList = await Promise.all(rows.map(async row => {
//         const response = await axios.get(`${userServiceUrl}/users/${row.friendUserID}`);
//         const { nickname } = response.data;
//         return { ...row, nickname };
//     }));

//     console.log(friendsList);
//     return friendsList;
// };

// const getNicknamedUserList = async (userid, nickname) => {
//     let keyword = '%' + nickname + '%';
    
//     let sql = `
//         SELECT u.user_id AS userID, u.nickname AS nickname
//         FROM cloudfriend.user u
//         WHERE u.nickname LIKE ? 
//         AND u.user_id NOT IN (SELECT f.user2_id FROM cloudfriend.friend f WHERE f.user1_id = ? OR f.user2_id = ?);
//     `;

//     let [rows] = await db.query(sql, [keyword, userid, userid]);
//     console.log(rows);
//     return rows;
// };

// const getReceivedFriendRequestsList = async (userId) => {
//     let sql = `
//         SELECT f.friend_id AS friendID, f.user2_id AS userID
//         FROM friend f
//         WHERE f.user1_id = ? AND f.accepted = 0;
//     `;
//     let [rows] = await db.execute(sql, [userId]);

//     // 각 user2_id에 대해 user 서비스에서 nickname을 가져옵니다.
//     const friendRequests = await Promise.all(rows.map(async row => {
//         const response = await axios.get(`${userServiceUrl}/users/${row.userID}`);
//         const { nickname } = response.data;
//         return { ...row, nickname };
//     }));

//     console.log(friendRequests);
//     return friendRequests;
// };

// const postFriendRequest = async (senderID, receiverID) => {
//     let sql = `
//         INSERT INTO friend (user1_id, user2_id, accepted) VALUES (?, ?, ?);
//     `;
    
//     let conn;
//     try{
//         conn = await db.getConnection();
//         await conn.beginTransaction(); //트랜잭션 시작

//         await conn.query(sql, [senderID, receiverID, 2]);
//         await conn.query(sql, [receiverID, senderID, 0]);

//         await conn.commit(); //트랜잭션 커밋

//     }catch (err){
//         await conn.rollback(); //트랜잭션 롤백
//         throw err;

//     }finally{
//         if(conn) conn.release(); //커넥션 반환
//     }
// };

// const patchFriendRequest = async (receiverID, senderID) => {
//     let sql = `
//         UPDATE friend
//         SET accepted = 1
//         WHERE user1_id = ? AND user2_id = ?;
//     `;
    
//     let conn;
//     try {
//         conn = await db.getConnection();
//         await conn.beginTransaction(); // 트랜잭션 시작

//         await conn.query(sql, [receiverID, senderID]);
//         await conn.query(sql, [senderID, receiverID]);

//         await conn.commit(); // 트랜잭션 커밋
//     } catch (err) {
//         await conn.rollback(); // 트랜잭션 롤백
//         throw err;
//     } finally {
//         if (conn) conn.release(); // 커넥션 반환
//     }
// };

// const deleteFriend = async(friendIDs) => {
//     console.log(friendIDs);

//     let sql = `
//         DELETE FROM friend f
//         WHERE f.friendID IN (?);
//     `;
    
//     let conn;
//     try{
//         conn = await db.getConnection();
//         await conn.beginTransaction(); //트랜잭션 시작

//         await conn.query(sql, [friendIDs]);

//         await conn.commit(); //트랜잭션 커밋

//     }catch (err){
//         await conn.rollback(); //트랜잭션 롤백
//         throw err;
//     }finally{
//         if(conn) conn.release(); //커넥션 반환
//     }
// };

// const checkValidUser = async (userId) => {
//     // user 서비스에서 사용자 존재 여부를 확인합니다.
//     const response = await axios.get(`${userServiceUrl}/users/${userId}`);
//     return response.status === 200; // 상태 코드 200이면 유효한 사용자
// };

// const getFriendIDs = async (user1ID, user2ID) => {
//     let sql = `
//         SELECT f.friend_id
//         FROM friend f
//         WHERE f.user1_id = ? AND f.user2_id = ? 
//         UNION
//         SELECT f.friend_id
//         FROM friend f
//         WHERE f.user1_id = ? AND f.user2_id = ?;
//     `;
//     let [rows] = await db.execute(sql, [user1ID, user2ID, user2ID, user1ID]);

//     const friendIDs = rows.map(row => row.friend_id);
//     return friendIDs;
// };

// module.exports = {
//     getMyFriendsList,
//     getNicknamedUserList,
//     getReceivedFriendRequestsList,
//     postFriendRequest,
//     patchFriendRequest,
//     deleteFriend,
//     checkValidUser,
//     getFriendIDs,
// };
 