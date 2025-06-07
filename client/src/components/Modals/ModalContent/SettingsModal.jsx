import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActivePlayerName } from '../../../utils/selectors';
import { setActivePlayerName } from '../../../store/reducers/playersReducer';

import Modal from 'react-modal';

import { CUSTOM_STYLES } from '../../../constants';

const SettingsModal = ({ closeModal }) => {
    const dispatch = useDispatch();

    const playerName = useSelector(getActivePlayerName);

    const [nameValue, setNameValue] = useState(playerName || '');

    const onClick = () => {
        if (!nameValue) {
            alert('Введіть, будь ласка, ваше ім\'я');
            return;
        }

        dispatch(setActivePlayerName(nameValue));

        try {
            localStorage.setItem('MAFIA_GAME_PLAYER_NAME', nameValue);
        } catch (e) {
        }

        closeModal();
    };

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
                        Закрити
                    </button>
                ) : null}
                <button className="form-button" onClick={onClick}>
                    Зберегти
                </button>
            </div>
        </div>
    </Modal>;
};

export default SettingsModal;