const express = require('express');
const { GameController } = require('./controller');
const { requestHandler } = require('../../handlers/request');

const router = express.Router();

router.get('/data', requestHandler(GameController.getData));

module.exports = router;
