const config = require('../../config');

class GameService {
    static async getData() {

        return {
            baseUrl: config.baseUrl,
        };
    }
}

module.exports = { GameService };