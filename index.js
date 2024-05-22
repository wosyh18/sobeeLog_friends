const express = require('express');
const router = express.Router();

router.use('/friends', require('./friends'));

module.exports = router;