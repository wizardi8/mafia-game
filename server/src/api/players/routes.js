const express = require('express');
const { PlayersController } = require('./controller');
const { requestHandler } = require('../../handlers/request');

const router = express.Router();

router.get('/login', requestHandler(PlayersController.login));

router.get('/', requestHandler(PlayersController.getAllByRoomId));

router.get('/:id', requestHandler(PlayersController.get));

router.put('/:id', requestHandler(PlayersController.update));

router.post('/', requestHandler(PlayersController.create));

router.delete('/:id', requestHandler(PlayersController.delete));

module.exports = router;
