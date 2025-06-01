import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    rooms: [],
    activeRoomId: null,
    isUserConnectedToRoom: false,
};

const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        setRooms(state, action) {
            state.rooms = action.payload;
        },
        setActiveRoomId(state, action) {
            state.activeRoomId = action.payload;
        },
        updateActiveRoom(state, action) {
            const { id, data = {} } = action.payload || {};

            state.rooms = state.rooms.map((room) => {
                if (room.id === id) {
                    return { ...room, ...data };
                }
                return room;
            });
        },
        setUserConnectedToRoom(state, action) {
            state.isUserConnectedToRoom = action.payload;
        },
    },
});

export const { setRooms, updateActiveRoom, setActiveRoomId, setUserConnectedToRoom } = roomsSlice.actions;
export default roomsSlice.reducer;
