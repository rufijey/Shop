import axios from "axios";
import AuthStore from "./store/AuthStore";
import {getFingerprint} from "./services/FingerprintService";
import router from "./router";
import authStore from "./store/AuthStore";

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});
api.interceptors.request.use(async config => {

    if (localStorage.getItem('access_token')) {
        config.headers.authorization = `Bearer ${localStorage.getItem('access_token')}`
    }
    return config;
}, error => {
});

api.interceptors.response.use(response => {
    return response;
}, async error => {
    if (!error.config._retry && error.response.status === 401) {
        error.config._retry = true;
        try {
            if (localStorage.getItem('access_token')) {
                await authStore.refresh()
                error.config.headers.authorization = `Bearer ${localStorage.getItem('access_token')}`
                return api.request(error.config)
            }
        } catch (err) {
            await authStore.resetUser()
            await router.navigate('/user/login')
        }
    } else {
        await authStore.resetUser()
        await router.navigate('/user/login')
    }
    return Promise.reject(error);
});

export default api;
