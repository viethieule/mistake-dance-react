import axios from 'axios';
import { history } from '.';

const instance = axios.create({
    baseURL: 'http://localhost/DanceClass/'
});

instance.interceptors.request.use(config => {
    const token = window.localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error)
});

instance.interceptors.response.use(undefined, function (error) {
    if (error && error.response) {
        const { status, headers } = error.response;
        if (status === 401 && headers['www-authenticate'] === 'Bearer') {
            window.localStorage.removeItem('jwt');
            history.push('/login');
        }
    }

    return Promise.reject(error);
})

export default instance;