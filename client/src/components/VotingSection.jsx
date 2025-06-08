import React, { useMemo, useState } from 'react';
import { ALERT_MESSAGES, BUTTON_MESSAGES } from '../constants';

const VotingSection = ({ socket, players, activeRoom, activePlayer }) => {
    const [selectedPlayerId, setSelectedPlayerId] = useState();
    const [confirmed, setConfirmed] = useState(false);

    const selectPlayers = useMemo(() => {
        if (!Array.isArray(players)) return [];

        const result = players.filter((player) => player.alive);
        setSelectedPlayerId(result[0]?.id);

        return result;
    }, [players]);

    return (
        <div className="voting-section">
            <div><b>Вигнати гравця:</b></div>
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
                    socket.emit('vote', {
                        roomId: activeRoom?.id,
                        playerId: selectedPlayerId,
                        voterId: activePlayer?.id,
                        activePlayers: selectPlayers,
                    });
                }}
            >
                {confirmed ? BUTTON_MESSAGES.CONFIRMED : BUTTON_MESSAGES.CONFIRM}
            </button>
        </div>
    );
};

export default VotingSection;