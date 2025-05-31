const { MongoDB } = require('../../MongoDB');

class PlayersModel {
    static getAuthData() {
        return MongoDB.getInstance()?.collections.players.findOne();
    }
}

module.exports = { PlayersModel };