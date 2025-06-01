const http = require('http');
const { Server } = require('socket.io');

const config = require('../config');
const { RoomsService } = require('../api/rooms');
const { PlayersService } = require('../api/players');
const { getRandomRoles } = require('./helpers');

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
        console.log(`Player connected: ${socket.id}`);

        socket.on('join_room', async ({ roomId, playerName }) => {
            console.log('join_room event');

            const playerId = socket.id;
            const room = await RoomsService.get({ id: roomId });

            if (!room) {
                console.log('[Connection error] Room not found');
                return;
            }

            const roomData = {
                ...room,
                players: [...room.players, playerId],
            };

            await RoomsService.update({
                id: roomId,
                data: roomData,
            });
            await PlayersService.create({
                data: {
                    roomId,
                    playerName,
                    id: playerId,
                    alive: true,
                },
            });

            socket.join(roomId);
            io.to(roomId).emit('game_update', {
                key: 'player_connected',
                playerId,
                roomData,
            });

            console.log(`Player ${playerId} joined to room ${roomId}`);
        });

        socket.on('disconnect', async () => {
            console.log('disconnect event');

            const playerId = socket.id;
            const player = await PlayersService.get({
                id: playerId,
            });

            if (!player) {
                console.log('[Disconnect error] Player not found');
                return;
            }

            const room = await RoomsService.get({ id: player.roomId });
            const players = room.players.filter((id) => id !== playerId);
            const roomData = room ? {
                ...room,
                players,
                ...(!players.length
                        ? {
                            status: 'waiting',
                            currentPhase: 'night',
                            roles: [],
                        }
                        : {}
                ),
            } : {};

            if (room) {
                await RoomsService.update({
                    id: player.roomId,
                    data: roomData,
                });
            } else {
                console.log('[Disconnect error] Room not found');
            }

            await PlayersService.delete({ id: playerId });

            io.to(player.roomId).emit('game_update', {
                key: 'player_disconnected',
                playerId,
                roomData,
            });

            console.log('Player disconnected:', playerId);
        });

        socket.on('start_game', async ({ roomId }) => {
            console.log('start_game event');

            const room = await RoomsService.get({ id: roomId });

            if (!room) {
                console.log('[start_game error] room not found');
                return;
            }

            const playerIds = room.players;
            const roomPlayers = await PlayersService.getAllByRoomId({ roomId });

            if (playerIds.length !== roomPlayers.length) {
                console.log('[start_game error] playerIds.length !== roomPlayers.length');
                return;
            }

            const roles = getRandomRoles(playerIds);
            const roomData = {
                ...room,
                roles,
                status: 'in_game',
                currentPhase: 'night',
            };

            await RoomsService.update({
                id: roomId,
                data: roomData,
            });

            for (const id of playerIds) {
                io.to(id).emit('role_assigned', { role: roles[id], roomData, roomId });
            }
        });

        // socket.on('vote', ({ roomId, playerId }) => {
        //     // Обробка голосування
        //     console.log('Vote', playerId);
        //     io.to(roomId).emit('game_update', { voted: playerId });
        // });


    });

    server.listen(config.port, () => {
        console.log(`Sockets server started with port ${config.port}`);
    });
};

module.exports = { initSockets };