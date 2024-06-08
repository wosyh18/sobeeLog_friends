const axios = require('axios');
const https = require('https');

const agent = new https.Agent({
    rejectUnauthorized: false
});

const client = axios.create({
    httpsAgent: agent,
    baseURL: `http://${process.env.INGRESS_HOST}`,
    headers: {
        'content-Type': 'application/json',
    }
})

module.exports = {client};