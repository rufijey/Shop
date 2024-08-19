import axios from "axios";
import AuthStore from "./store/AuthStore";
import {getFingerprint} from "./services/FingerprintService";
import router from "./router";

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});
api.interceptors.request.use(async config => {

    const expires_time = localStorage.getItem('expires_time');
    if (expires_time < Date.now()) {
        if (localStorage.getItem('access_token')) {
            const fingerprint = await getFingerprint();

            await axios.post('auth/refresh',
                {
                    'fingerprint': fingerprint
                },
                {
                    headers: {
                        'authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                })
                .then(res => {
                    AuthStore.login(res.data)
                }).catch(err => {
                    console.log(err.message)
                    AuthStore.logout()
                    router.navigate('/user/login')
                })
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
});

export default api;
