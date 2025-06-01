import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveRoomId, getBaseUrl } from '../utils/selectors';
import { setUserConnectedToRoom, updateActiveRoom } from '../store/reducers/roomsReducer';

import GamePage from './GamePage';
import RoomsList from './RoomsList';
import { io } from 'socket.io-client';

const MainPage = () => {
    const dispatch = useDispatch();

    const baseUrl = useSelector(getBaseUrl);
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
        }
    }, [activeRoomId, playerName]);

    return (
        <div className="page">
            <div className="header">
                <div>Mafia UA</div>
                <div>{playerName}</div>
                {activeRoomId ? (
                    <div className="add-button-container">
                        <button className="form-button" onClick={() => {
                            socket.disconnect();
                            window.location.reload();
                        }}>
                            Leave room
                        </button>
                    </div>
                ) : null}
            </div>
            <div className="main-section">
                {activeRoomId
                    ? <GamePage activeRoomId={activeRoomId} socket={socket} />
                    : <RoomsList />
                }
            </div>
            <div className="footer">Copyright © 2025 wizardi</div>
        </div>
    );
};

export default MainPage;