import { combineReducers } from '@reduxjs/toolkit';

import modalReducer from './modalReducer';
import roomsReducer from './roomsReducer';
import gameDataReducer from './gameDataReducer';

const rootReducer = combineReducers({
    modal: modalReducer,
    rooms: roomsReducer,
    gameData: gameDataReducer,
});

export default rootReducer;