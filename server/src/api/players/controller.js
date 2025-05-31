const { PlayersService } = require('./service');

class PlayersController {
    static async login(req, res) {
        const { password } = req.query;

        const data = await PlayersService.login({ password });
        res.json({ data });
    }
}

module.exports = { PlayersController };