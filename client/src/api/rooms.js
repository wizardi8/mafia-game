import axios from './../lib/axios';

export const getAllRooms = () => {
    return axios.get('/api/rooms');
};

export const getRoomData = (id) => {
    return axios.get(`/api/rooms/${id}`);
}