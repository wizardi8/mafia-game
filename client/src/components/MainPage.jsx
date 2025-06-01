import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveRoomId, getBaseUrl, getStoreRooms } from '../utils/selectors';
import { setUserConnectedToRoom, updateActiveRoom } from '../store/reducers/roomsReducer';

import GamePage from './GamePage';
import RoomsList from './RoomsList';
import { io } from 'socket.io-client';
import { setGameData } from '../store/reducers/gameDataReducer';

const MainPage = () => {
    const dispatch = useDispatch();

    const baseUrl = useSelector(getBaseUrl);
    const rooms = useSelector(getStoreRooms);
    const activeRoomId = useSelector(getActiveRoomId);

    const playerName = useMemo(() => {
        const savedName = localStorage.getItem('MAFIA_PLAYER_GAME');
        if (savedName) return savedName;

        const names = ['Alex', 'Bob', 'Carl', 'Dave', 'Eve', 'Fred', 'Jane'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomHash = Math.random().toString(36).substring(2, 7);
        const name = `${randomName}_${randomHash}`;
        localStorage.setItem('MAFIA_PLAYER_GAME', name);

        return name;
    }, []);

    const socket = useMemo(() => {
        return io(baseUrl);
    }, [baseUrl]);

    const activeRoom = useMemo(() => {
        if (!Array.isArray(rooms)) return null;

        return rooms.find((room) => room.id === activeRoomId);
    }, [rooms, activeRoomId]);

    useEffect(() => {
        if (activeRoomId && playerName) {
            socket.emit('join_room', { roomId: activeRoomId, playerName });

            socket.on('game_update', (data = {}) => {
                const { key, roomData = {} } = data || {};
                const { id } = roomData || {};
                console.log(data);

                switch (key) {
                    case 'player_connected':
                    case 'player_disconnected': {
                        dispatch(updateActiveRoom({ id, data: roomData }));
                        break;
                    }
                    default: {
                        break;
                    }
                }

                dispatch(setUserConnectedToRoom(true));
            });

            socket.on('role_assigned', (data = {}) => {
                const { role, roomData, roomId } = data || {};
                console.log(data);

                dispatch(setGameData({ currentRole: role }));
                dispatch(updateActiveRoom({ id: roomId, data: roomData }));
            });
        }
    }, [activeRoomId, playerName]);

    return (
        <div className="page">
            <div className="header">
                <div>Mafia UA</div>
                <div>{playerName}</div>
                {activeRoomId ? (
                    <div className="add-button-container">
                        {activeRoom?.status === 'waiting' ? (
                            <button className="form-button" onClick={() => {
                                socket.emit('start_game', { roomId: activeRoomId });
                            }}>
                                ▶️ Start game
                            </button>
                        ) : null}
                        <button className="form-button" onClick={() => {
                            socket.disconnect();
                            window.location.reload();
                        }}>
                            {activeRoom?.status === 'in_game' ? '↩️ Leave game' : '↩️ Leave room'}
                        </button>
                    </div>
                ) : null}
            </div>
            <div className="main-section">
                {activeRoomId
                    ? <GamePage activeRoom={activeRoom} />
                    : <RoomsList />
                }
            </div>
            <div className="footer">Copyright © 2025 wizardi</div>
        </div>
    );
};

export default MainPage;