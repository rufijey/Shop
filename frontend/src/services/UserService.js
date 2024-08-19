import axios from "axios";
import authStore from "../store/AuthStore";
import router from "../router";
import api from "../api";

export default class UserService {
    static async login(data) {
        await axios.post('/auth/login', data)
            .then(res => {
                authStore.login(res.data);
                router.navigate('/user/me')
            }).catch(err => {
                console.log(err.message)
            })
    }
    static async register(data) {
        await axios.post('/auth/register', data)
            .then(res => {
                authStore.login(res.data);
                router.navigate('/user/me')
            }).catch(err => {
                console.log(err.message)
            })
    }
    static async getByEmail(email) {
        return await api.get(`/user/email`, {
            params: { email }
        });
    }
    static async makeAdmin(id){
        return await api.patch(`/user/makeAdmin/${id}`)
    }
    static async makeUnAdmin(id){
        return await api.patch(`/user/makeUnAdmin/${id}`)
    }
}