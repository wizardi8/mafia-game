const { PlayersService } = require('./service');

class PlayersController {
    static async login(req, res) {
        const { password } = req.query;

        const data = await PlayersService.login({ password });
        res.json({ data });
    }

    static async get(req, res) {
        const { id } = req.params;

        const data = await PlayersService.get({ id });
        res.json({ data });
    }

    static async update(req, res) {
        const { id } = req.params;

        await PlayersService.update({ id, data: req.body });
        res.send();
    }

    static async create(req, res) {
        await PlayersService.create({ data: req.body });
        res.send();
    }

    static async delete(req, res) {
        const { id } = req.params;

        await PlayersService.delete({ id });
        res.send();
    }
}

module.exports = { PlayersController };