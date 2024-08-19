import api from "../api";
import axios from "axios";

export default class ProductService{
    static async getAll(page, per_page){
        return await axios.get('/products', {
            params:{
                page: page,
                per_page: per_page
            }
        })
    }
    static async get(slug){
        return await axios.get(`/products/${slug}`)
    }
    static async post(data){
       return await api.post(`/products`,data)

    }
    static async delete(slug){
        return await api.delete(`/products/${slug}`)
    }
    static async update(data, slug){
        return await api.post(`/products/${slug}`,data)

    }
}