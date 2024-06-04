//userID를 
const http = require("http");

module.exports = async (userID) => {
    const getOptions = {
        method: "GET",
        headers: {
            "Content-Type" : "application/json",
        },
    };

    const requestBody = {
        userID : userID
    };

    return new Promise((resolve, reject) => {
        const req = http.request(`http:///userInfo/:userID`, getOptions, (response) => {
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
