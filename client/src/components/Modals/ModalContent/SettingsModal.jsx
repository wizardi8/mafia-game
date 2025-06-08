import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActivePlayerName } from '../../../utils/selectors';
import { setActivePlayerName, updateActivePlayer } from '../../../store/reducers/playersReducer';

import Modal from 'react-modal';

import { ALERT_MESSAGES, BUTTON_MESSAGES, CUSTOM_STYLES } from '../../../constants';

const SettingsModal = ({ closeModal, modalProps = {} }) => {
    const dispatch = useDispatch();

    const playerName = useSelector(getActivePlayerName);

    const [nameValue, setNameValue] = useState(playerName || '');

    const { playerId } = modalProps || {};

    const onClick = () => {
        if (!nameValue) {
            alert(ALERT_MESSAGES.ENTER_PLAYER_NAME);
            return;
        }

        dispatch(setActivePlayerName(nameValue));

        if (playerId) {
            dispatch(updateActivePlayer({ id: playerId, data: { name: nameValue } }));
        }

        try {
            localStorage.setItem('MAFIA_GAME_PLAYER_NAME', nameValue);
        } catch (e) {
        }

        closeModal();
    };

    if (playerId) {
        alert(ALERT_MESSAGES.CANNOT_OPEN_SETTINGS);
        return null;
    }

    return <Modal
        isOpen={true}
        style={CUSTOM_STYLES}
    >
        <div className="settings-modal">
            <div>Ваше ім'я:</div>
            <input type="text" name="name" value={nameValue} onChange={(e) => {
                setNameValue(e.target.value);
            }} />
            <div className="settings-modal-buttons">
                {playerName ? (
                    <button className="form-button" onClick={() => closeModal()}>
                        {BUTTON_MESSAGES.CLOSE}
                    </button>
                ) : null}
                <button className="form-button" onClick={onClick}>
                    {BUTTON_MESSAGES.SAVE}
                </button>
            </div>
        </div>
    </Modal>;
};

export default SettingsModal;