import axios from "axios";
import AuthStore from "./store/AuthStore";
import {getFingerprint} from "./services/FingerprintService";
import router from "./router";
import authStore from "./store/AuthStore";

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});
api.interceptors.request.use(async config => {

    const expires_time = localStorage.getItem('expires_time');
    if (expires_time < Date.now()) {
        if (localStorage.getItem('access_token')) {
            await authStore.refresh()
        }
        else{
            AuthStore.logout()
            await router.navigate('/user/login')
        }

    }


    if (localStorage.getItem('access_token')) {
        config.headers.authorization = `Bearer ${localStorage.getItem('access_token')}`
    }
    else{
        AuthStore.logout()
        await router.navigate('/user/login')
    }
    return config;
}, error => {
});

api.interceptors.response.use(response => {
    return response;
}, async error => {
    AuthStore.logout()
    await router.navigate('/user/login')
});

export default api;
