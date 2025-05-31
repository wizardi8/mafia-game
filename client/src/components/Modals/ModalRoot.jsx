import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getModal } from '../../utils/selectors';
import { setModal } from '../../store/reducers/modalReducer';

import LoginUserModal from './ModalContent/LoginUserModal';

import { MODAL_TYPES } from '../../constants';

const MODALS_BY_TYPE = {
    [MODAL_TYPES.LOGIN_USER]: LoginUserModal,
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
