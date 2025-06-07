const http = require('http');
const { Server } = require('socket.io');

const config = require('../config');

const { RoomsService } = require('../api/rooms');
const { PlayersService } = require('../api/players');

const { getRandomRoles, checkGameEnd } = require('./helpers');

const { ROLES } = require('../../../shared/constants/players');
const { DEFAULT_ROOM, ROOM_PHASES, ROOM_STATUSES } = require('../../../shared/constants/rooms');

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
            const playerData = {
                roomId,
                name: playerName,
                id: playerId,
                alive: true,
            };
            await PlayersService.create({
                data: playerData,
            });

            socket.join(roomId);
            io.to(roomId).emit('game_update', {
                key: 'player_connected',
                playerId,
                roomData,
                playerData,
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
                ...(!players.length ? { ...DEFAULT_ROOM } : {}),
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
                status: ROOM_STATUSES.IN_GAME,
                currentPhase: ROOM_PHASES.NIGHT,
            };

            await RoomsService.update({
                id: roomId,
                data: roomData,
            });

            for (const id of playerIds) {
                io.to(id).emit('game_update', {
                    key: 'role_assigned',
                    role: roles[id],
                    roomData,
                });
            }
        });

        socket.on('night_action', async ({ roomId, playerId }) => {
            console.log('night_action event');

            const room = await RoomsService.get({ id: roomId });
            const target = await PlayersService.get({ id: playerId });

            if (!room || !target) {
                !room && console.log('[start_game error] room not found');
                !target && console.log('[start_game error] player victim not found');
                return;
            }

            await PlayersService.update({
                id: playerId, data: {
                    ...target,
                    alive: false,
                },
            });

            const roomData = {
                ...room,
                history: [...room.history, { phase: ROOM_PHASES.NIGHT, killed: playerId }],
                currentPhase: ROOM_PHASES.DAY,
            };

            await RoomsService.update({
                id: roomId,
                data: roomData,
            });

            io.to(roomId).emit('game_update', {
                key: 'player_eliminated',
                playerId,
                roomData,
            });
        });

        socket.on('vote', async ({ roomId, voterId, playerId, activePlayers }) => {
            console.log('vote event');

            const room = await RoomsService.get({ id: roomId });
            if (!room) {
                console.log('[start_game error] room not found');
                return;
            }

            if (!room.votes[playerId]) {
                room.votes[playerId] = [];
            }
            room.votes[playerId].push(voterId);

            await RoomsService.update({
                id: roomId,
                data: room,
            });

            const totalVotes = Object.values(room.votes).reduce((a, b) => a + b.length, 0);
            const playerCount = activePlayers.length;

            if (totalVotes >= playerCount) {
                const [eliminatedId] = Object.entries(room.votes).sort((a, b) => b[1] - a[1])[0];

                room.votes = {};
                room.currentPhase = ROOM_PHASES.NIGHT;
                room.history.push({ phase: 'voted', eliminated: eliminatedId });

                await PlayersService.update({
                    id: eliminatedId, data: {
                        alive: false,
                    },
                });

                const roomPlayers = await PlayersService.getAllByRoomId({ roomId });

                const winner = checkGameEnd(room, roomPlayers);

                if (winner) {
                    room.players.forEach((id) => {
                        // TODO update many
                        PlayersService.update({
                            id,
                            data: { alive: true },
                        });
                    });
                }

                const newRoomData = {
                    ...room,
                    ...(winner ? DEFAULT_ROOM : {}),
                };

                await RoomsService.update({
                    id: roomId,
                    data: newRoomData,
                });

                io.to(roomId).emit('game_update', {
                    key: 'player_eliminated',
                    playerId: eliminatedId,
                    roomData: newRoomData,
                    winner,
                });
            }
        });
    });

    server.listen(config.port, () => {
        console.log(`Sockets server started with port ${config.port}`);
    });
};

module.exports = { initSockets };