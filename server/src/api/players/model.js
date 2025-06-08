const { MongoDB } = require('../../MongoDB');

class PlayersModel {
    static getAuthData() {
        return MongoDB.getInstance()?.collections.players.findOne();
    }

    static getAllByRoomId({ roomId }) {
        return MongoDB.getInstance()?.collections.players.find({ roomId }).toArray();
    }

    static get({ id }) {
        return MongoDB.getInstance()?.collections.players.findOne({ id });
    }

    static update({ id, data }) {
        return MongoDB.getInstance()?.collections.players.updateOne({ id }, { $set: data });
    }

    static updateMany({ roomId, data }) {
        return MongoDB.getInstance()?.collections.players.updateMany({ roomId }, { $set: data });
    }

    static create(data) {
        return MongoDB.getInstance()?.collections.players.insertOne(data);
    }

    static delete({ id }) {
        return MongoDB.getInstance()?.collections.players.deleteOne({ id });
    }
}

module.exports = { PlayersModel };