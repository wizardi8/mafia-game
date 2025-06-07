import { combineReducers } from '@reduxjs/toolkit';

import modalReducer from './modalReducer';
import roomsReducer from './roomsReducer';
import playersReducer from './playersReducer';
import gameDataReducer from './gameDataReducer';

const rootReducer = combineReducers({
    modal: modalReducer,
    rooms: roomsReducer,
    players: playersReducer,
    gameData: gameDataReducer,
});

export default rootReducer;