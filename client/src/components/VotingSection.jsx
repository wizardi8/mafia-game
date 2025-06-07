import React, { useMemo, useState } from 'react';

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
                    socket.emit('vote', {
                        roomId: activeRoom?.id,
                        playerId: selectedPlayerId,
                        voterId: activePlayer?.id,
                        activePlayers: selectPlayers,
                    });
                }}
            >
                {confirmed ? 'Підтверджено ✔️' : 'Підтвердити'}
            </button>
        </div>
    );
};

export default VotingSection;