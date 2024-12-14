import api from "../api";
import axios from "axios";

export default class ProductService{
    static async getAll(filters){
        return await axios.get('/products', {
            params:{
                page: filters.page,
                per_page: filters.per_page,
                search: filters.search,
                characteristic_ids: filters.characteristic_ids,
                category_id: filters.category_id,
                price_range: {min: filters.price_range.min, max: filters.price_range.max},
                sort_by:{ field:filters.sort_by.field, direction:filters.sort_by.direction}
            }
        })
    }
    static async get(slug){
        return await api.get(`/products/${slug}`)
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
    static async getMaxPrice(){
        return await axios.get('/products/max-price');
    }
}