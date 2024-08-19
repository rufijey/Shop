import { makeAutoObservable } from 'mobx';
import {jwtDecode} from 'jwt-decode';

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

    login(tokenData) {
        this.setUserFromToken(tokenData.access_token);
        localStorage.setItem('access_token', tokenData.access_token);
        const expires_time =Date.now() + tokenData.expires_in*1000
        localStorage.setItem('expires_time', expires_time);
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
