const { RoomsService } = require('./service');

class RoomsController {
    static async getAll(req, res) {
        const data = await RoomsService.getAll();
        res.json({ data });
    }

    static async get(req, res) {
        const { id } = req.params;

        const data = await RoomsService.get({ id });
        res.json({ data });
    }

    static async update(req, res) {
        const { id } = req.params;

        await RoomsService.update({ id, data: req.body });
        res.send();
    }

    static async create(req, res) {
        await RoomsService.create({ data: req.body });
        res.send();
    }

    static async delete(req, res) {
        const { id } = req.params;

        await RoomsService.delete({ id });
        res.send();
    }
}

module.exports = { RoomsController };