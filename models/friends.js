const {db} = require("./db");

const getMyFriendsList = async(userid) => {
    let sql = `
        SELECT f.friendID, f.user2ID as friendUserID, u.nickname 
        FROM friend f
        JOIN user u
        ON f.user2ID = u.userID
        WHERE f.user1ID = ? AND f.accepted = 1;
    `;
    let [rows, fields] = await db.execute(sql, [userid]);
    console.log(rows);
    return rows;
}

const getNicknamedUserList = async(userid, nickname) => {
    let keyword = '%' + nickname + '%';
    
    let sql = `
        SELECT u.userID AS userId, u.nickname AS nickname
        FROM account_book.user u
        WHERE u.nickname LIKE ? 
        AND u.userID NOT IN (SELECT f.user2ID FROM account_book.friend f WHERE f.user1ID = ? OR f.user2ID = ?);
    `;

    let [rows] = await db.query(sql, [keyword, userid, userid]);
    console.log(rows);
    return rows;
}

const getReceivedFriendRequestsList = async(userid) => {
    let sql = `
        SELECT f.friendID as friendID, f.user2ID as userID, u.nickname as nickname
        FROM friend f
        JOIN user u
        ON f.user2ID = u.userID
        WHERE f.user1ID = ? AND f.accepted = 0;
    `;
    let [rows] = await db.execute(sql, [userid]);
    console.log(rows);
    return rows;
}

const postFriendRequest = async(senderID, receiverID) => {
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

const patchFriendRequest = async(receiverID, senderID) => {
    let sql = `
        UPDATE friend f
        SET accepted = 1
        WHERE f.user1ID = ? AND f.user2ID = ?;
    `;
    
    let conn;
    try{
        conn = await db.getConnection();
        await conn.beginTransaction(); //트랜잭션 시작

        await conn.query(sql, [receiverID, senderID]);
        await conn.query(sql, [senderID, receiverID]);

        await conn.commit(); //트랜잭션 커밋

    }catch (err){
        await conn.rollback(); //트랜잭션 롤백
        throw err;
    }finally{
        if(conn) conn.release(); //커넥션 반환
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

const checkValidUser = async(userid) => {
    let sql = `SELECT exists(SELECT 1 FROM user u WHERE u.userID LIKE ?) as result;`;
    let [rows] = await db.execute(sql, [userid]);
    const result = rows[0].result === 1;
    //console.log(rows);
    return result;
}

const getFriendIDs = async(user1ID, user2ID) => {
    let sql = `
        SELECT f.friendID
        FROM friend f
        WHERE f.user1ID = ? AND f.user2ID = ? 
        UNION
        SELECT f.friendID
        FROM friend f
        WHERE f.user1ID = ? AND f.user2ID = ?;
    `;
    let [rows] = await db.execute(sql, [user1ID, user2ID, user2ID, user1ID]);
    //console.log(rows);

    const friendIDs = rows.map(row => row.friendID);
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