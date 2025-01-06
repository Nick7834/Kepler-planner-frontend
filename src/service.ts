import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token')

    return config;
});

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_API_BACK;

const backgroundSearch = axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    }
})

export default instance;
export { backgroundSearch };