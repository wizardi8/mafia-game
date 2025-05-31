import axios from './../lib/axios';

export const getUserHasAccess = (password) => {
    return axios.get(`/api/users/login?password=${password}`);
};