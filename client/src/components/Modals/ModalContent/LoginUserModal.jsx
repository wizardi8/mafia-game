import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserHasAccess } from '../../../store/reducers/gameDataReducer';

import Modal from 'react-modal';

import { getUserHasAccess } from '../../../api/users';

import { ALERT_MESSAGES, BUTTON_MESSAGES, CUSTOM_STYLES } from '../../../constants';

const LoginUserModal = ({ closeModal }) => {
    const dispatch = useDispatch();

    const [passwordValue, setPasswordValue] = useState('');

    const onLogin = () => {
        if (!passwordValue) {
            alert(ALERT_MESSAGES.NO_PASSWORD);
            return;
        }

        getUserHasAccess(passwordValue)
            .then((response) => {
                const userHasAccess = Boolean(response?.data);
                dispatch(setUserHasAccess(userHasAccess));

                if (userHasAccess) {
                    closeModal();
                    return;
                }

                alert(ALERT_MESSAGES.INCORRECT_PASSWORD);
            })
            .catch((error) => {
                console.log(error);
                alert(ALERT_MESSAGES.SOMETHING_WENT_WRONG);
            });
    };

    return <Modal
        isOpen={true}
        style={CUSTOM_STYLES}
    >
        <div className="login-user-modal">
            <div>Login</div>
            <input type="text" name="password" value={passwordValue} placeholder="password" onChange={(e) => {
                setPasswordValue(e.target.value);
            }} />
            <div className="login-user-modal-buttons">
                <button className="form-button" onClick={onLogin}>
                    {BUTTON_MESSAGES.NEXT}
                </button>
            </div>
        </div>
    </Modal>;
};

export default LoginUserModal;