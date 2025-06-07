import React, { useState } from 'react';

import VotingSection from './VotingSection';
import MafiaVotingSection from './MafiaVotingSection';

import { ROLES } from '../../../shared/constants/players';
import { ROOM_PHASES } from '../../../shared/constants/rooms';

const PlayerActions = ({ socket, activeRoom, currentRole, players, activePlayer }) => {
    const [mafiaWon, setMafiaWon] = useState(false);

    switch (currentRole) {
        case ROLES.MAFIA: {
            if (mafiaWon) return <div>Немає активних мирних жителів. Ви виграли! 🎉</div>;
            if (!activePlayer?.alive) return <div>Вас було вбито ☠️</div>;
            if (activeRoom?.currentPhase === ROOM_PHASES.DAY) {
                return <VotingSection
                    socket={socket}
                    players={players}
                    activeRoom={activeRoom}
                    activePlayer={activePlayer}
                />;
            }

            return <MafiaVotingSection
                socket={socket}
                players={players}
                activeRoom={activeRoom}
                setMafiaWon={setMafiaWon}
            />;
        }
        case ROLES.CITIZEN: {
            if (mafiaWon) return <div>Немає активних мирних жителів. Мафія виграла! 😎</div>;
            if (!activePlayer?.alive) return <div>Вас було вбито ☠️</div>;
            if (activeRoom?.currentPhase === ROOM_PHASES.DAY) {
                return (
                    <VotingSection
                        socket={socket}
                        players={players}
                        activeRoom={activeRoom}
                        activePlayer={activePlayer}
                    />
                );
            }

            return <div>(Зараз ходить мафія)</div>;
        }
        default: {
            return null;
        }
    }
};

export default PlayerActions;