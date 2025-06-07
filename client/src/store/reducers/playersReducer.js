import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    players: [],
    activePlayerId: null,
};

const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        setPlayers(state, action) {
            state.players = action.payload;
        },
        setActivePlayerId(state, action) {
            state.activePlayerId = action.payload;
        },
        addPlayer(state, action) {
            const { id } = action.payload || {};

            if (!state.players.some((player) => player.id === id)) {
                state.players = [...state.players, action.payload];
            }
        },
        deletePlayer(state, action) {
            state.players = state.players.filter((player) => player.id !== action.payload);
        },
        updateActivePlayer(state, action) {
            const { id, data = {} } = action.payload || {};

            state.players = state.players.map((player) => {
                if (player.id === id) {
                    return { ...player, ...data };
                }
                return player;
            });
        },
    },
});

export const { setPlayers, addPlayer, deletePlayer, updateActivePlayer, setActivePlayerId } = playersSlice.actions;
export default playersSlice.reducer;
