import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../store/reducers/modalReducer';
import { setGameData } from '../store/reducers/gameDataReducer';
import { setActiveRoomId, setUserConnectedToRoom, updateActiveRoom } from '../store/reducers/roomsReducer';
import { getActivePlayerId, getActivePlayerName, getActiveRoomId, getBaseUrl, getStoreRooms } from '../utils/selectors';
import {
    addPlayer,
    deletePlayer,
    setActivePlayerId,
    updateActivePlayer,
    setActivePlayerName,
} from '../store/reducers/playersReducer';

import { io } from 'socket.io-client';

import { getRoom } from '../api/rooms';

import Footer from './Footer';
import GamePage from './GamePage';
import RoomsList from './RoomsList';

import { ROOM_STATUSES } from '../../../shared/constants/rooms';
import { ALERT_MESSAGES, BUTTON_MESSAGES, getWinnerText, MODAL_TYPES } from '../constants';

const MainPage = () => {
    const dispatch = useDispatch();

    const baseUrl = useSelector(getBaseUrl);
    const rooms = useSelector(getStoreRooms);
    const activeRoomId = useSelector(getActiveRoomId);
    const playerName = useSelector(getActivePlayerName);
    const activePlayerId = useSelector(getActivePlayerId);

    const socket = useMemo(() => {
        return io(baseUrl);
    }, [baseUrl]);

    const activeRoom = useMemo(() => {
        if (!Array.isArray(rooms)) return null;

        return rooms.find((room) => room.id === activeRoomId);
    }, [rooms, activeRoomId]);

    useEffect(() => {
        try {
            if (playerName) return;

            const name = localStorage.getItem('MAFIA_GAME_PLAYER_NAME');

            if (!name) {
                throw new Error();
            }

            dispatch(setActivePlayerName(name));
        } catch (e) {
            dispatch(setModal({ modalType: MODAL_TYPES.SETTINGS, modalProps: { playerId: activePlayerId } }));
        }
    }, [playerName, activePlayerId]);

    useEffect(() => {
        if (activePlayerId) return;

        if (activeRoomId && playerName) {
            getRoom(activeRoomId).then((response) => {
                const room = response.data;

                if (!room) {
                    alert(ALERT_MESSAGES.SOMETHING_WENT_WRONG);
                    return;
                }
                if (room.status !== ROOM_STATUSES.WAITING) {
                    dispatch(setActiveRoomId(null));
                    alert(ALERT_MESSAGES.GAME_ALREADY_STARTED);
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
                                alert(getWinnerText(winner));
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
    }, [activeRoomId, playerName, activePlayerId]);

    return (
        <div className="page">
            <div className="header">
                <div className="page-logo">Mafia UA</div>
                <div className="header-right-section">
                    <div className="header-user-name text-trim">{playerName}</div>
                    <button className="form-button" onClick={() => {
                        dispatch(setModal({
                            modalType: MODAL_TYPES.SETTINGS,
                            modalProps: { playerId: activePlayerId },
                        }));
                    }}>
                        {BUTTON_MESSAGES.SETTINGS}
                    </button>
                </div>
            </div>
            <div className="main-section">
                {activeRoomId
                    ? <GamePage activeRoom={activeRoom} socket={socket} />
                    : <RoomsList />
                }
            </div>
            <Footer />
        </div>
    );
};

export default MainPage;