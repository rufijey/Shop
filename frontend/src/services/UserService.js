import axios from "axios";
import authStore from "../store/AuthStore";
import router from "../router";
import api from "../api";

export default class UserService {
    static async login(data) {
        return await axios.post('/auth/login', data)
    }
    static async register(data) {
        return await axios.post('/auth/register', data)
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