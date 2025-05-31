import axios from 'axios';

axios.interceptors.request.use(async function(config) {
    return {
        ...config,
        headers: {
            ...config.headers,
        },
    };
});

axios.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const { data = {}, status = 500 } = error?.response || {};
        return Promise.reject({
            data,
            status,
        });
    },
);

export default axios;
