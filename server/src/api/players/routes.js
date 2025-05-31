const express = require('express');
const { PlayersController } = require('./controller');
const { requestHandler } = require('../../handlers/request');

const router = express.Router();

router.get('/login', requestHandler(PlayersController.login));

module.exports = router;
