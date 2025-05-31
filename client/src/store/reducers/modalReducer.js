import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    modalType: undefined,
    modalProps: undefined,
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setModal(state, action) {
            state.modalType = action.payload.modalType;
            state.modalProps = action.payload.modalProps;
        },
    },
});

export const { setModal } = modalSlice.actions;
export default modalSlice.reducer;
