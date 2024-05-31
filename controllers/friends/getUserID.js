const http = require("http");
const {db} = require("./db");
const { friendsDB } = require("../../models");
//nickname을 기반으로 user_id 가져오기
module.exports = async (nickname) => {
    try {


    return new Promise((resolve, reject) => {
        const getOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        // 요청 생성 및 전송
    const reqUser = http.request(`http://userInfo/${userId}`, getOptions, (response) => {
        let data = '';

        // 응답 데이터를 수신
        response.on('data', (chunk) => {
            data += chunk;
        });

        // 응답 완료 후 처리
        response.on('end', () => {
            if (response.statusCode === 200) {
                const userInfo = JSON.parse(data);
                console.log("Received user info:", userInfo);

                res.status(200).json(userInfo);
            } else {
                reject(new Error(`Failed to get user info. Status code: ${response.statusCode}`));
            }
        });
    });

    reqUser.on("error", (err) => {
        reject(err);
    });

    // 요청을 끝냄
    reqUser.end();
    });
} catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
    }
};
