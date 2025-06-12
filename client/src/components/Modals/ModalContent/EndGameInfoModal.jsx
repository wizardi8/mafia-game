import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getStorePlayers } from '../../../utils/selectors';

import Modal from 'react-modal';

import { BUTTON_MESSAGES, CUSTOM_STYLES, getWinnerText } from '../../../constants';
import { ROLES } from '../../../../../shared/constants/players';

const EndGameInfoModal = ({ closeModal, modalProps = {} }) => {
    const players = useSelector(getStorePlayers);

    const { winner, roles = {} } = modalProps || {};

    const { mafia = [], citizens = [] } = useMemo(() => {
        if (roles && Array.isArray(players)) {
            return {
                mafia: players.filter(p => roles[p.id] === ROLES.MAFIA),
                citizens: players.filter(p => roles[p.id] === ROLES.CITIZEN),
            };
        }

        return {};
    }, []);

    const renderPlayerList = (players = []) => {
        return players.map((player, index) => {
            return (<span key={index}>{player?.name}{index < (players.length - 1) ? ', ' : ''}</span>);
        });
    };

    return <Modal
        isOpen={true}
        style={CUSTOM_STYLES}
    >
        <div className="modal">
            <div>Гра завершена!</div>
            <div>Переможці: {getWinnerText(winner)} </div>
            <div>Мафія: {renderPlayerList(mafia)}</div>
            <div>Мирні жителі: {renderPlayerList(citizens)}</div>
            <div className="modal-buttons">
                <button className="form-button" onClick={() => closeModal()}>
                    {BUTTON_MESSAGES.CLOSE}
                </button>
            </div>
        </div>
    </Modal>;
};

export default EndGameInfoModal;