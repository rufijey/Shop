import {makeAutoObservable} from 'mobx';
import {jwtDecode} from 'jwt-decode';
import {getFingerprint} from "../services/FingerprintService";
import UserService from "../services/UserService";
import register from "../pages/User/Register/Register";
import router from "../router";
import EmailService from "../services/EmailService";

class AuthStore {
    user = null;
    credentials = {
        email: '',
        password: ''
    }
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
        if (token){
            this.user = jwtDecode(token);
        }
    }

    async resetUser() {
        this.user = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_time');
        const orderStore = (await import('./OrderStore')).default;
        await orderStore.fetchCurrentOrder();
    }


    async login(loginForm) {
        loginForm.fingerprint = await getFingerprint()
        const res = await UserService.login(loginForm)
        this.setUserFromToken(res.data.access_token);
        localStorage.setItem('access_token', res.data.access_token);
        const expires_time = Date.now() + res.data.expires_in * 1000
        localStorage.setItem('expires_time', expires_time);
        await router.navigate('/user/me')
        const orderStore = (await import('./OrderStore')).default;
        await orderStore.fetchCurrentOrder();
    }

    async register(registrationForm) {
        registrationForm.fingerprint = await getFingerprint()
        const res = await UserService.register(registrationForm)
    }
    async verify(id, hash) {
        const fingerprint = await getFingerprint()
        const res = await EmailService.verify(id, hash, fingerprint)
        this.setUserFromToken(res.data.access_token);
        localStorage.setItem('access_token', res.data.access_token);
        const expires_time = Date.now() + res.data.expires_in * 1000
        localStorage.setItem('expires_time', expires_time);
        await router.navigate('/user/me')
        const orderStore = (await import('./OrderStore')).default;
        await orderStore.fetchCurrentOrder();
    }

    async refresh() {
        const res = await UserService.refresh()
        this.setUserFromToken(res.data.access_token);
        localStorage.setItem('access_token', res.data.access_token);
        const expires_time = Date.now() + res.data.expires_in * 1000
        localStorage.setItem('expires_time', expires_time);

    }

    async logout() {
        const res = await UserService.logout()
        await this.resetUser()
        await router.navigate('/')
    }

    get isAuthenticated() {
        return this.user !== null;
    }

    get isAdmin() {
        if (this.user) {
            return this.user.role === 'admin';
        }
        return false
    }
}

const authStore = new AuthStore();
export default authStore;
