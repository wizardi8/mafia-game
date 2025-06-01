const { MongoDB } = require('../../MongoDB');

class PlayersModel {
    static getAuthData() {
        return MongoDB.getInstance()?.collections.players.findOne();
    }

    static get({ id }) {
        return MongoDB.getInstance()?.collections.players.findOne({ id });
    }

    static update({ id, data }) {
        return MongoDB.getInstance()?.collections.players.updateOne({ id }, { $set: data });
    }

    static create(data) {
        return MongoDB.getInstance()?.collections.players.insertOne(data);
    }

    static delete({ id }) {
        return MongoDB.getInstance()?.collections.players.deleteOne({ id });
    }
}

module.exports = { PlayersModel };