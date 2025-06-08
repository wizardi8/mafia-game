const { PlayersModel } = require('./model');

class PlayersService {
    static async login({ password }) {
        const authData = await PlayersModel.getAuthData();
        const { password: dbPassword } = authData || {};

        return password === dbPassword;
    }

    static async getAllByRoomId({ roomId }) {
        return PlayersModel.getAllByRoomId({ roomId });
    }

    static async get({ id }) {
        return PlayersModel.get({ id });
    }

    static async update({ id, data }) {
        return PlayersModel.update({ id, data });
    }

    static async updateMany({ roomId, data }) {
        return PlayersModel.updateMany({ roomId, data });
    }

    static async create({ data = {} }) {
        return PlayersModel.create(data);
    }

    static async delete({ id }) {
        return PlayersModel.delete({ id });
    }
}

module.exports = { PlayersService };