const {db} = require("./db");

const getMyFriendsList = async (userId) => {
    let sql = `
        SELECT f.friend_id AS friendID, f.user2_id AS friendUserID, u.nickname 
        FROM friend f
        JOIN user u ON f.user2_id = u.user_id
        WHERE f.user1_id = ? AND f.accepted = 1;
    `;
    let [rows, fields] = await db.execute(sql, [userId]);
    console.log(rows);
    return rows;
}

const getNicknamedUserList = async(userid, nickname) => {
    let keyword = '%' + nickname + '%';
    
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
    let [rows] = await db.execute(sql, [userId]);
    console.log(rows);
    return rows;
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