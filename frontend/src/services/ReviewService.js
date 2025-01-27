import api from "../api";
import axios from "axios";

export default class ReviewService {
    static async get(product_id) {
        return await axios.get('/reviews', {
            params: {
                product_id: product_id
            }
        })
    }

    static async post(data) {
        return await api.post(`/reviews`, data)
    }

    static async delete(id) {
        return await api.delete(`/reviews/${id}`)
    }

    static async update(id, data) {
        return await api.patch(`/reviews/${id}`, data)
    }
}