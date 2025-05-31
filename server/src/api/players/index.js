const { PlayersModel } = require('./model');
const { PlayersService } = require('./service');
const playersApiRouter = require('./routes');

module.exports = {
    PlayersModel,
    PlayersService,
    playersApiRouter,
};
