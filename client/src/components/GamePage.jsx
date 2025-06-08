import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayers } from '../store/reducers/playersReducer';
import {
    getActivePlayerId,
    getActiveRoomId,
    getGameDate,
    getIsUserConnectedToRoom,
    getStorePlayers,
} from '../utils/selectors';

import { getAllPlayers } from '../api/players';

import PlayersList from './PlayersList';
import PlayerActions from './PlayerActions';
import LoadingCenterSpinner from './LoadingCenterSpinner';

import { ALERT_MESSAGES, BUTTON_MESSAGES } from '../constants';
import { PLAYERS_MIN_LIMIT, PLAYERS_TOTAL_LIMIT, ROLE_NAMES, ROLES } from '../../../shared/constants/players';
import { ROOM_PHASE_NAMES, ROOM_PHASES, ROOM_STATUS_NAMES, ROOM_STATUSES } from '../../../shared/constants/rooms';

const GamePage = ({ activeRoom, socket }) => {
    const dispatch = useDispatch();

    const players = useSelector(getStorePlayers);
    const { currentRole } = useSelector(getGameDate);
    const activeRoomId = useSelector(getActiveRoomId);
    const activePlayerId = useSelector(getActivePlayerId);
    const isUserConnectedToRoom = useSelector(getIsUserConnectedToRoom);

    const activePlayer = useMemo(() => {
        if (!Array.isArray(players)) return null;

        return players.find((player) => player.id === activePlayerId);
    }, [players, activePlayerId]);

    const isGameStarted = !!currentRole;
    const isDisabledStartGame = activeRoom?.players?.length < PLAYERS_MIN_LIMIT;

    useEffect(() => {
        if (!activeRoom?.id) return;

        setTimeout(() => {
            getAllPlayers(activeRoom?.id)
                .then((result) => {
                    const { data = [] } = result || {};

                    dispatch(setPlayers(data));
                })
                .catch((error) => {
                    console.log(error);
                });
        }, 1500);
    }, [activeRoom?.id, isGameStarted]);

    return (
        isUserConnectedToRoom ? (
            <>
                <div className="game-header">
                    <div className="game-header-meta-info">
                        <div><b>Назва кімнати:</b> <span className="text-trim">{activeRoom?.name}</span></div>
                        <div><b>Статус
                            гри:</b> {`${ROOM_STATUS_NAMES[activeRoom?.status]} ${!isGameStarted ? '⌛️' : '▶️'}`}
                        </div>
                        <div><b>Кількість
                            гравців:</b> {`${activeRoom?.players?.length}/${PLAYERS_TOTAL_LIMIT} 👥`}
                        </div>
                    </div>
                    {activeRoomId ? (
                        <div className="game-header-buttons">
                            <button className="form-button" onClick={() => {
                                socket.disconnect();
                                window.location.reload();
                            }}>
                                {activeRoom?.status === ROOM_STATUSES.IN_GAME
                                    ? BUTTON_MESSAGES.LEAVE_GAME
                                    : BUTTON_MESSAGES.LEAVE_ROOM}
                            </button>
                            {activeRoom?.status === ROOM_STATUSES.WAITING ? (
                                <button
                                    className="form-button"
                                    title={isDisabledStartGame ? ALERT_MESSAGES.PLAYERS_MIN_LIMIT : ''}
                                    onClick={() => {
                                        if (isDisabledStartGame) {
                                            alert(ALERT_MESSAGES.PLAYERS_MIN_LIMIT);
                                            return;
                                        }

                                        socket.emit('start_game', { roomId: activeRoomId });
                                    }}
                                >
                                    {BUTTON_MESSAGES.START_GAME}
                                </button>
                            ) : null}
                        </div>
                    ) : null}
                </div>
                <PlayersList players={players} />
                <div className="game-user-info">
                    {isGameStarted
                        ? (<>
                            <div>
                                <b>
                                    Фаза гри:
                                </b> {ROOM_PHASE_NAMES[activeRoom?.currentPhase]} {activeRoom?.currentPhase === ROOM_PHASES.NIGHT ? '🌘' : '☀️'}
                            </div>
                            <div><b>Ваша
                                роль:</b> {ROLE_NAMES[currentRole]} {currentRole === ROLES.MAFIA ? '🧛🏾' : '👱🏼‍♂️'}
                            </div>
                        </>)
                        : (<>
                            <div>{isDisabledStartGame
                                ? (`(${ALERT_MESSAGES.PLAYERS_MIN_LIMIT})`)
                                : (`(${ALERT_MESSAGES.START_GAME})`)}</div>
                        </>)}
                </div>
                <PlayerActions
                    socket={socket}
                    players={players}
                    activeRoom={activeRoom}
                    currentRole={currentRole}
                    activePlayer={activePlayer}
                />
            </>
        ) : (
            <LoadingCenterSpinner />
        )
    );
};

export default GamePage;