import axios from 'axios';
import { api_baseurl } from '../services/data'

const instance = axios.create({
    baseURL: `${api_baseurl}/api/`,
    timeout: 10000,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'accept': 'application/json'
    },
});

// Adding Interceptor
instance.interceptors.request.use(function (config) {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        config.headers.Authorization = token ? `Bearer ${token}` : '';
        return config;
    }
    return config
});

export default instance
