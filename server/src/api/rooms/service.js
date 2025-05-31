const { RoomsModel } = require('./model');

class RoomsService {
    static async getAll() {
        return RoomsModel.getAll();
    }

    static async get({ id }) {
        return RoomsModel.get({ id });
    }

    static async update({ id, data }) {
        return RoomsModel.update({ id, data });
    }

    static async create({ data = {} }) {
        return RoomsModel.create(data);
    }

    static async delete({ id }) {
        return RoomsModel.delete({ id });
    }
}

module.exports = { RoomsService };