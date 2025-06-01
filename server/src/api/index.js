const express = require('express');

const { gameApiRouter } = require('./game');
const { roomsApiRouter } = require('./rooms');
const { playersApiRouter } = require('./players');

const router = express.Router();

router.use('/game', gameApiRouter);
router.use('/rooms', roomsApiRouter);
router.use('/players', playersApiRouter);

module.exports = router;