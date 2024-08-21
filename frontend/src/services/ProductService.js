import api from "../api";
import axios from "axios";

export default class ProductService{
    static async getAll(filters){
        return await axios.get('/products', {
            params:{
                page: filters.page,
                per_page: filters.per_page,
                title: filters.title,
                tag_ids: filters.tag_ids,
                category_id: filters.category_id,
                price_range: {min: filters.price_range.min, max: filters.price_range.max}
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
    static async maxPrice(){
        return await axios.get('/products/max-price');
    }
}