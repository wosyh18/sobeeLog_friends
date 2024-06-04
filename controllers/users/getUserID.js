// const http = require("http");
// const {db} = require("./db");
// const { friendsDB } = require("../../models");

// //nickname을 기반으로 user_id 가져오기
// module.exports = async (nickname) => {
//     try {
//     return new Promise((resolve, reject) => {
//         const getOptions = {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         };

//         // 요청 생성 및 전송
//     const reqUser = http.request(`/search?nickname=${nickname}`, getOptions, (response) => {
//         let data = '';

//         // 응답 데이터를 수신
//         response.on('data', (chunk) => {
//             data += chunk;
//         });

//         // 응답 완료 후 처리
//         response.on('end', () => {
//             if (response.statusCode === 200) {
//                 const userInfo = JSON.parse(data);
//                 console.log("Received user info:", userInfo);

//                 res.status(200).json(userInfo);
//             } else {
//                 reject(new Error(`Failed to get user info. Status code: ${response.statusCode}`));
//             }
//         });
//     });

//     reqUser.on("error", (err) => {
//         reject(err);
//     });

//     // 요청을 끝냄
//     reqUser.end();
//     });
// } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal Server Error" });
//     }
// };


//통신 코드 수정
// const http = require("http");

// module.exports = async (nickname) => {
//     const getOptions = {
//         method: "GET",
//         headers: {
//             "Content-Type" : "application/json",
//         },
//     };

//     const requestBody = {
//         nickname: nickname
//     };

//     const req = http.request(`http://search?nickname=${nickname}`, getOptions); // 요청 생성 및 전송

//     req.on("close", ()=>{
//         console.log("Request userId, nickname to user microservice")
//     });

//     req.on("error", (err) => {
//         console.error("Failed to send 'viewed' message!");
//         console.error(err && err.stack || err);
//     });

//     req.write(JSON.stringify(requestBody)); // Write the body to the request.
//     req.end(); // End the request.
// }

const http = require("http");

module.exports = async (nickname) => {
    const getOptions = {
        method: "GET",
        headers: {
            "Content-Type" : "application/json",
        },
    };

    const requestBody = {
        nickname: nickname
    };

    return new Promise((resolve, reject) => {
        const req = http.request(`http://search?nickname=${nickname}`, getOptions, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                if (response.statusCode === 200) {
                    try {
                        const userInfo = JSON.parse(data);
                        resolve(userInfo); // 응답 데이터를 Promise의 결과로 전달
                    } catch (err) {
                        reject(new Error('Failed to parse response'));
                    }
                } else {
                    reject(new Error(`Failed to get user info. Status code: ${response.statusCode}`));
                }
            });
        });

        req.on("close", () => {
            console.log("Request userId, nickname to user microservice");
        });

        req.on("error", (err) => {
            console.error("Failed to send 'viewed' message!");
            console.error(err && err.stack || err);
            reject(err);
        });

        req.write(JSON.stringify(requestBody)); // Write the body to the request.
        req.end(); // End the request.
    });
}
