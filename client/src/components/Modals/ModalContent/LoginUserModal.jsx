import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserHasAccess } from '../../../store/reducers/gameDataReducer';

import Modal from 'react-modal';

import { getUserHasAccess } from '../../../api/users';

import { CUSTOM_STYLES } from '../../../constants';

const LoginUserModal = ({ closeModal }) => {
    const dispatch = useDispatch();

    const [passwordValue, setPasswordValue] = useState('');

    const onLogin = () => {
        if (!passwordValue) {
            alert('No password');
            return;
        }

        getUserHasAccess(passwordValue)
            .then((response) => {
                debugger;
                const userHasAccess = Boolean(response?.data);
                dispatch(setUserHasAccess(userHasAccess));

                if (userHasAccess) {
                    closeModal();
                    return;
                }

                alert('[Error] Password is incorrect');
            })
            .catch((error) => {
                console.log(error);
                alert('[Error] Something went wrong');
            });
    };

    return <Modal
        isOpen={true}
        style={CUSTOM_STYLES}
    >
        <div className="login-user-modal">
            <div>Login</div>
            <input type="text" value={passwordValue} placeholder="password" onChange={(e) => {
                setPasswordValue(e.target.value);
            }} />
            <div className="login-user-modal-buttons">
                <button className="form-button" onClick={onLogin}>
                    Next
                </button>
            </div>
        </div>
    </Modal>;
};

export default LoginUserModal;