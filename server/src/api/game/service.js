const config = require('../../config');

class GameService {
    static async getData() {

        return {
            port: config.port,
            baseUrl: config.baseUrl,
        };
    }
}

module.exports = { GameService };