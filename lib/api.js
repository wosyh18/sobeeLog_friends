const axios = require('axios');

const client = axios.create({
    baseURL: `http://${process.env.INGRESS_HOST}:${process.env.INGRESS_PORT}`,
    headers:{
        'content-Type': 'application/json',
    }
})

module.exports ={client};