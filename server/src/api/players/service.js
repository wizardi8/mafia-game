const { PlayersModel } = require('./model');

class PlayersService {
    static async login({ password }) {
        const authData = await PlayersModel.getAuthData();
        const { password: dbPassword } = authData || {};

        return password === dbPassword;
    }
}

module.exports = { PlayersService };