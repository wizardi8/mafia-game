import React from 'react';
import { useSelector } from 'react-redux';
import { getStorePlayers } from '../../../utils/selectors';

import Modal from 'react-modal';

import { BUTTON_MESSAGES, CUSTOM_STYLES } from '../../../constants';
import { ROOM_PHASE_NAMES, ROOM_PHASES } from '../../../../../shared/constants/rooms';

const HistoryGameModal = ({ closeModal, modalProps = {} }) => {
    const players = useSelector(getStorePlayers);

    const { history } = modalProps || {};

    return <Modal
        isOpen={true}
        style={CUSTOM_STYLES}
    >
        <div className="modal">
            <div>Історія гри:</div>
            {history.length ? (
                history.map((historyItem, index) => {
                    const { phase, killed } = historyItem || {};
                    const player = players.find((player) => player.id === killed);
                    const playerName = player?.name || '-';
                    const gamePhase = ROOM_PHASE_NAMES[phase];
                    const actionName = phase === ROOM_PHASES.NIGHT ? 'вбито гравця' : 'вигнано гравця';

                    return <div>{index + 1}. Фаза гри: {gamePhase} - {actionName}: {playerName}</div>;
                })
            ) : (
                <div>Дані відсутні</div>
            )}
            <div className="modal-buttons">
                <button className="form-button" onClick={() => closeModal()}>
                    {BUTTON_MESSAGES.CLOSE}
                </button>
            </div>
        </div>
    </Modal>;
};

export default HistoryGameModal;