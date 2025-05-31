const { MongoDB } = require('../../MongoDB');

class RoomsModel {
    static getAll() {
        return MongoDB.getInstance()?.collections.rooms.find().toArray();
    }

    static get({ id }) {
        return MongoDB.getInstance()?.collections.rooms.findOne({ id });
    }

    static update({ id, data }) {
        return MongoDB.getInstance()?.collections.rooms.updateOne({ id }, { $set: data });
    }

    static create(data) {
        return MongoDB.getInstance()?.collections.rooms.insertOne(data);
    }

    static delete({ id }) {
        return MongoDB.getInstance()?.collections.rooms.deleteOne({ id });
    }
}

module.exports = { RoomsModel };