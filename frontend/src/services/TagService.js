import api from "../api";
import axios from "axios";

export default class TagService{
    static async getAll(title){
        return await axios.get('/tags',{
            params:{
                title: title
            }
        })
    }
    static async post(title, category){
       return await api.post(`/tags`,{
            title:title,
           category:category
        })

    }
    static async delete(id){
        return await api.delete(`/tags/${id}`)
    }
    static async update(id, title, category){
        return await api.patch(`/tags/${id}`,{
            title:title,
            category:category
        })
    }
}