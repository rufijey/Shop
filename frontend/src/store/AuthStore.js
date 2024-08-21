import { makeAutoObservable } from 'mobx';
import {jwtDecode} from 'jwt-decode';
import {getFingerprint} from "../services/FingerprintService";
import UserService from "../services/UserService";
import register from "../pages/User/Register/Register";
import router from "../router";

class AuthStore {
    user = null;

    constructor() {
        makeAutoObservable(this);
        this.initializeUser();
    }

    initializeUser() {
        const token = localStorage.getItem('access_token');
        if (token) {
            this.setUserFromToken(token);
        }
    }

    setUserFromToken(token) {
        this.user = jwtDecode(token);
    }

    async login(loginForm) {
        loginForm.fingerprint = await getFingerprint()
        const res = await UserService.login(loginForm)
        this.setUserFromToken(res.data.access_token);
        localStorage.setItem('access_token', res.data.access_token);
        const expires_time =Date.now() + res.data.expires_in*1000
        localStorage.setItem('expires_time', expires_time);
        await router.navigate('/user/me')
    }
    async register(registrationForm) {
        registrationForm.fingerprint = await getFingerprint()
        const res = await UserService.register(registrationForm)
        this.setUserFromToken(res.data.access_token);
        localStorage.setItem('access_token', res.data.access_token);
        const expires_time =Date.now() + res.data.expires_in*1000
        localStorage.setItem('expires_time', expires_time);
        await router.navigate('/user/me')
    }
    async refresh() {
        try {
            const fingerprint = await getFingerprint()
            const res = await UserService.refresh(fingerprint)
            this.setUserFromToken(res.data.access_token);
            localStorage.setItem('access_token', res.data.access_token);
            const expires_time =Date.now() + res.data.expires_in*1000
            localStorage.setItem('expires_time', expires_time);
        }
        catch (err){
            console.log(err.message)
            this.logout()
            await router.navigate('/user/login')
        }

    }
    logout() {
        this.user = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_time');
    }

    get isAuthenticated() {
        return this.user !== null;
    }
    get isAdmin() {
        if(this.user){
            return this.user.role === 'admin';
        }
        return false
    }
}

const authStore = new AuthStore();
export default authStore;
