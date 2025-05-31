const express = require('express');
const { RoomsController } = require('./controller');
const { requestHandler } = require('../../handlers/request');

const router = express.Router();

router.get('/', requestHandler(RoomsController.getAll));

router.get('/:id', requestHandler(RoomsController.get));

router.put('/:id', requestHandler(RoomsController.update));

router.post('/', requestHandler(RoomsController.create));

router.delete('/:id', requestHandler(RoomsController.delete));

module.exports = router;
