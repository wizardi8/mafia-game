const express = require('express');

const { playersApiRouter } = require('./players');
const { roomsApiRouter } = require('./rooms');

const router = express.Router();

router.use('/players', playersApiRouter);
router.use('/rooms', roomsApiRouter);

module.exports = router;