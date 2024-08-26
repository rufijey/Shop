import api from "../api";
import axios from "axios";

export default class OrderService{
    static async getCurrent(){
       return await api.get('/orders/current')
    }
    static async addProduct(product_id){
        return await api.post('/orders', {
            product_id: product_id
        })
    }
    static async getCompleted(){
        return await api.get('/orders/completed')
    }
    static async complete(){
        return await api.patch('/orders/complete')
    }
    static async removeProduct(productId){
        return await api.delete('/orders/product', )
    }
}