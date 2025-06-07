import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getActivePlayerId } from '../utils/selectors';

import { ROLES } from '../../../shared/constants/players';

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
                disabled={confirmed}
                onChange={(e) => {
                    if (confirmed) return;
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
                disabled={confirmed}
                onClick={() => {
                    if (!selectedPlayerId) {
                        alert('Для підтвердження виберіть гравця');
                        return;
                    }
                    if (confirmed) return;
                    setConfirmed(true);
                    socket.emit('night_action', { roomId: activeRoom?.id, playerId: selectedPlayerId });
                }}
            >
                {confirmed ? 'Підтверджено ✔️' : 'Підтвердити'}
            </button>
        </div>
    );
};

export default MafiaVotingSection;