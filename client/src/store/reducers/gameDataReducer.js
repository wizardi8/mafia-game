import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    baseUrl: '',
    userHasAccess: false,
    currentRole: null,
};

const gameDataSlice = createSlice({
    name: 'gameData',
    initialState,
    reducers: {
        setGameData(state, action) {
            return { ...state, ...action.payload };
        },
        setUserHasAccess(state, action) {
            state.userHasAccess = action.payload;
        },
    },
});

export const { setGameData, setUserHasAccess } = gameDataSlice.actions;
export default gameDataSlice.reducer;
