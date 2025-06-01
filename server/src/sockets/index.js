const http = require('http');
const { Server } = require('socket.io');

const config = require('../config');
const { RoomsService } = require('../api/rooms');
const { PlayersService } = require('../api/players');


const initSockets = (app) => {
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: config.baseUrl,
            methods: ['GET', 'POST'],
        },
    });
    console.log('Sockets server started');

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join_room', async ({ roomId, playerName }) => {
            console.log('Player joined room:', roomId);
            socket.join(roomId);

            const room = await RoomsService.get({ id: roomId });
            const roomData = {
                ...room,
                players: [...room.players, socket.id],
            };
            await RoomsService.update({
                id: roomId,
                data: roomData,
            });
            await PlayersService.create({
                data: {
                    roomId,
                    playerName,
                    id: socket.id,
                },
            });

            io.to(roomId).emit('game_update', {
                key: 'player_connected',
                playerId: socket.id,
                roomData,
            });
        });

        // socket.on('start_game', (roomId) => {
        //     // Призначення ролей і повідомлення гравцям
        //     console.log('Start game');
        //     io.to(roomId).emit('phase_change', { phase: 'night' });
        // });

        // socket.on('vote', ({ roomId, playerId }) => {
        //     // Обробка голосування
        //     console.log('Vote', playerId);
        //     io.to(roomId).emit('game_update', { voted: playerId });
        // });

        socket.on('disconnect', async () => {
            const player = await PlayersService.get({
                id: socket.id,
            });
            if (player) {
                const room = await RoomsService.get({ id: player.roomId });
                const roomData = {
                    ...room,
                    players: room.players.filter((playerId) => playerId !== socket.id),
                };
                await RoomsService.update({
                    id: player.roomId,
                    data: roomData,
                });
                await PlayersService.delete({ id: socket.id });
                io.to(player.roomId).emit('game_update', {
                    key: 'player_disconnected',
                    playerId: socket.id,
                    roomData,
                });
            }
            console.log('Player disconnected:', socket.id);
        });
    });

    server.listen(config.port, () => {
        console.log(`Sockets server started with port ${config.port}`);
    });
};

module.exports = { initSockets };