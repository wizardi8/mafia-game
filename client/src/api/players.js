import axios from './../lib/axios';

export const getAllPlayers = (roomId) => {
    return axios.get(`/api/players?roomId=${roomId}`);
};