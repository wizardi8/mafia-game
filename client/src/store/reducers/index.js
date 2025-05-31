import { combineReducers } from '@reduxjs/toolkit';

import modalReducer from './modalReducer';
import gameDataReducer from './gameDataReducer';

const rootReducer = combineReducers({
    modal: modalReducer,
    gameData: gameDataReducer,
});

export default rootReducer;