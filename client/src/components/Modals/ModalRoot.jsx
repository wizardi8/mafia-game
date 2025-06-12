import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getModal } from '../../utils/selectors';
import { setModal } from '../../store/reducers/modalReducer';

import SettingsModal from './ModalContent/SettingsModal';
import LoginUserModal from './ModalContent/LoginUserModal';
import HistoryGameModal from './ModalContent/HistoryGameModal';
import EndGameInfoModal from './ModalContent/EndGameInfoModal';

import { MODAL_TYPES } from '../../constants';

const MODALS_BY_TYPE = {
    [MODAL_TYPES.SETTINGS]: SettingsModal,
    [MODAL_TYPES.LOGIN_USER]: LoginUserModal,
    [MODAL_TYPES.HISTORY_GAME]: HistoryGameModal,
    [MODAL_TYPES.END_GAME_INFO]: EndGameInfoModal,
};

const ModalRoot = () => {
    const dispatch = useDispatch();
    const modalState = useSelector(getModal);

    const closeModal = () => {
        dispatch(setModal({}));
    };

    const SpecificModal = modalState.modalType && MODALS_BY_TYPE[modalState.modalType];

    const defaultModalProps = { closeModal };

    return (
        SpecificModal ? <SpecificModal {...defaultModalProps} modalProps={modalState.modalProps} /> : null
    );
};

export default ModalRoot;
