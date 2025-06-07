import axios from './../lib/axios';

export const getAllRooms = () => {
    return axios.get('/api/rooms');
};

export const getRoom = (roomId) => {
    return axios.get(`/api/rooms/${roomId}`);
}