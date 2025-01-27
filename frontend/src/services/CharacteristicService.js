import api from "../api";
import axios from "axios";

export default class CharacteristicService {
    static async getAll(search){
        return await axios.get('/characteristics',{
            params:{
               search:search
            }
        })
    }
    static async getGrouped(search){
        return await axios.get('/characteristics/grouped',{
            params:{
                search:search
            }
        })
    }
    static async getByIds(characteristic_ids){
        return await axios.get('/characteristics/ids',{
            params:{
                characteristic_ids:characteristic_ids
            }
        })
    }
    static async post(body, type){
       return await api.post(`/characteristics`,{
            body:body,
           type:type
        })

    }
    static async delete(id){
        return await api.delete(`/characteristics/${id}`)
    }
    static async update(id, body, type){
        return await api.patch(`/characteristics/${id}`,{
            body:body,
            type:type
        })
    }
}