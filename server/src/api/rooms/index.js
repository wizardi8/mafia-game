const { RoomsModel } = require('./model');
const { RoomsService } = require('./service');
const roomsApiRouter = require('./routes');

module.exports = {
    RoomsModel,
    RoomsService,
    roomsApiRouter,
};
