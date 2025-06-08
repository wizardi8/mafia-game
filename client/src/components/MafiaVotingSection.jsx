import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getActivePlayerId } from '../utils/selectors';

import { ROLES } from '../../../shared/constants/players';
import { ALERT_MESSAGES, BUTTON_MESSAGES } from '../constants';

const MafiaVotingSection = ({ socket, players, activeRoom, setMafiaWon }) => {
    const [selectedPlayerId, setSelectedPlayerId] = useState();
    const [confirmed, setConfirmed] = useState(false);

    const activePlayerId = useSelector(getActivePlayerId);

    const selectPlayers = useMemo(() => {
        if (!Array.isArray(players)) return [];

        const result = players.filter((player) => {
            const { id, alive } = player || {};

            return id !== activePlayerId && alive && activeRoom.roles[id] !== ROLES.MAFIA;
        });
        setSelectedPlayerId(result[0]?.id);

        if (!result.length && players.length) {
            setMafiaWon(true);
        }

        return result;
    }, [players, activePlayerId, activeRoom]);

    return (
        <div className="voting-section">
            <div><b>Вибрати жертву:</b></div>
            <select
                value={selectedPlayerId}
                name="voting-select"
                onChange={(e) => {
                    if (confirmed) {
                        alert(ALERT_MESSAGES.PLAYER_ALREADY_CONFIRMED);
                        return;
                    }

                    setSelectedPlayerId(e.target.value);
                }}
            >
                {selectPlayers.map((player) => {
                    const { id, name } = player || {};
                    return <option key={id} value={id}>{name}</option>;
                })}
            </select>
            <button
                className="form-button"
                onClick={() => {
                    if (confirmed) {
                        alert(ALERT_MESSAGES.PLAYER_ALREADY_CONFIRMED);
                        return;
                    }
                    if (!selectedPlayerId) {
                        alert(ALERT_MESSAGES.CHOOSE_PLAYER);
                        return;
                    }

                    setConfirmed(true);
                    socket.emit('night_action', { roomId: activeRoom?.id, playerId: selectedPlayerId });
                }}
            >
                {confirmed ? BUTTON_MESSAGES.CONFIRMED : BUTTON_MESSAGES.CONFIRM}
            </button>
        </div>
    );
};

export default MafiaVotingSection;