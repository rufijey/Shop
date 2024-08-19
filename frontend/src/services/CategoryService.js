import api from "../api";
import axios from "axios";

export default class CategoryService{
    static async getAll(){
        return await axios.get('/categories')
    }
    static async post(category){
       return await api.post(`/categories`,{
            title:category
        })

    }
    static async delete(id){
        return await api.delete(`/categories/${id}`)
    }
    static async update(id, category){
        return await api.patch(`/categories/${id}`,{
            title:category
        })
    }
}