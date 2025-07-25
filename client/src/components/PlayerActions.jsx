import React, { useState } from 'react';

import VotingSection from './VotingSection';
import MafiaVotingSection from './MafiaVotingSection';

import { ALERT_MESSAGES } from '../constants';
import { ROLES } from '../../../shared/constants/players';
import { ROOM_PHASES } from '../../../shared/constants/rooms';

const PlayerActions = ({ socket, activeRoom, currentRole, players, activePlayer }) => {
    const [mafiaWon, setMafiaWon] = useState(false);

    switch (currentRole) {
        case ROLES.MAFIA: {
            if (mafiaWon) return <div className="player-hint">{ALERT_MESSAGES.NO_CITIZEN_FOR_MAFIA}</div>;
            if (!activePlayer?.alive) return <div className="player-hint">{ALERT_MESSAGES.YOU_HAVE_BEEN_KILLED}</div>;
            if (activeRoom?.currentPhase === ROOM_PHASES.DAY) {
                return (
                    <>
                        <VotingSection
                            socket={socket}
                            players={players}
                            activeRoom={activeRoom}
                            activePlayer={activePlayer}
                        />
                        <div className="player-hint">({ALERT_MESSAGES.DAY_MOVE_HINT})</div>
                    </>
                );
            }

            return (
                <>
                    <MafiaVotingSection
                        socket={socket}
                        players={players}
                        activeRoom={activeRoom}
                        setMafiaWon={setMafiaWon}
                    />
                    <div className="player-hint">({ALERT_MESSAGES.NIGHT_MOVE_HINT})</div>
                </>
            );
        }
        case ROLES.CITIZEN: {
            if (mafiaWon) return <div className="player-hint">{ALERT_MESSAGES.NO_CITIZEN_FOR_CITIZEN}</div>;
            if (!activePlayer?.alive) return <div className="player-hint">{ALERT_MESSAGES.YOU_HAVE_BEEN_KILLED}</div>;
            if (activeRoom?.currentPhase === ROOM_PHASES.DAY) {
                return (
                    <>
                        <VotingSection
                            socket={socket}
                            players={players}
                            activeRoom={activeRoom}
                            activePlayer={activePlayer}
                        />
                        <div className="player-hint">({ALERT_MESSAGES.DAY_MOVE_HINT})</div>
                    </>
                );
            }

            return <div className="player-hint">({ALERT_MESSAGES.NIGHT_MOVE})</div>;
        }
        default: {
            return null;
        }
    }
};

export default PlayerActions;