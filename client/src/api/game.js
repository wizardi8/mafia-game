import axios from './../lib/axios';

export const getGameData = () => {
    return axios.get('/api/game/data');
};