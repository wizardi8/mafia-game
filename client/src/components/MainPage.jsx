import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../store/reducers/modalReducer';
import { setGameData } from '../store/reducers/gameDataReducer';
import { getActivePlayerName, getActiveRoomId, getBaseUrl, getStoreRooms } from '../utils/selectors';
import { setActiveRoomId, setUserConnectedToRoom, updateActiveRoom } from '../store/reducers/roomsReducer';
import {
    addPlayer,
    deletePlayer,
    setActivePlayerId,
    updateActivePlayer,
    setActivePlayerName,
} from '../store/reducers/playersReducer';

import { io } from 'socket.io-client';

import { getRoom } from '../api/rooms';

import GamePage from './GamePage';
import RoomsList from './RoomsList';

import { MODAL_TYPES } from '../constants';
import { ROOM_STATUSES } from '../../../shared/constants/rooms';
import { WINNER_NAMES, WINNERS } from '../../../shared/constants/players';

const MainPage = () => {
    const dispatch = useDispatch();

    const baseUrl = useSelector(getBaseUrl);
    const rooms = useSelector(getStoreRooms);
    const activeRoomId = useSelector(getActiveRoomId);
    const playerName = useSelector(getActivePlayerName);

    const socket = useMemo(() => {
        return io(baseUrl);
    }, [baseUrl]);

    const activeRoom = useMemo(() => {
        if (!Array.isArray(rooms)) return null;

        return rooms.find((room) => room.id === activeRoomId);
    }, [rooms, activeRoomId]);

    useEffect(() => {
        try {
            const name = localStorage.getItem('MAFIA_GAME_PLAYER_NAME');

            if (!name) {
                throw new Error();
            }

            dispatch(setActivePlayerName(name));
        } catch (e) {
            dispatch(setModal({ modalType: MODAL_TYPES.SETTINGS }));
        }
    }, []);

    useEffect(() => {
        if (activeRoomId && playerName) {
            getRoom(activeRoomId).then((response) => {
                const room = response.data;

                if (!room) alert('Something went wrong!');
                if (room.status !== ROOM_STATUSES.WAITING) {
                    dispatch(setActiveRoomId(null));
                    alert('Вибачте, гра вже триває');
                    return;
                }

                socket.emit('join_room', { roomId: activeRoomId, playerName });

                socket.on('game_update', (data = {}) => {
                    const { key, playerId, role, winner, roomData = {}, playerData = {} } = data || {};
                    const { id } = roomData || {};
                    const { name } = playerData || {};
                    console.log(data);

                    switch (key) {
                        case 'player_connected': {
                            if (name === playerName) {
                                dispatch(setUserConnectedToRoom(true));
                                dispatch(setActivePlayerId(playerId));
                            }
                            dispatch(addPlayer(playerData));
                            break;
                        }
                        case 'player_disconnected': {
                            dispatch(deletePlayer(playerId));
                            break;
                        }
                        case 'player_eliminated': {
                            if (winner) {
                                dispatch(setGameData({ currentRole: null }));
                                alert(`Гра завершена! Переможці: ${WINNER_NAMES[winner]} ${winner === WINNERS.CITIZENS
                                    ? '👱🏼‍♂️'
                                    : '🧛🏾'}`);
                            } else {
                                dispatch(updateActivePlayer({ id: playerId, data: { alive: false } }));
                            }
                            break;
                        }
                        case 'role_assigned': {
                            dispatch(setGameData({ currentRole: role }));
                            break;
                        }
                        default: {
                            break;
                        }
                    }

                    dispatch(updateActiveRoom({ id, data: roomData }));
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [activeRoomId, playerName]);

    return (
        <div className="page">
            <div className="header">
                <div className="page-logo">Mafia UA</div>
                <div className="header-user-name">{playerName}</div>
                <button className="form-button" onClick={() => {
                    dispatch(setModal({ modalType: MODAL_TYPES.SETTINGS }));
                }}>
                    ⚙️
                </button>
            </div>
            <div className="main-section">
                {activeRoomId
                    ? <GamePage activeRoom={activeRoom} socket={socket} />
                    : <RoomsList />
                }
            </div>
            <div className="footer">Copyright © 2025 wizardi</div>
        </div>
    );
};

export default MainPage;