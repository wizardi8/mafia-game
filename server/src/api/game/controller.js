const { GameService } = require('./service');

class GameController {
    static async getData(req, res) {
        const data = await GameService.getData();
        res.json({ data });
    }
}

module.exports = { GameController };