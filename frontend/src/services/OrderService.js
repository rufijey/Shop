import api from "../api";
import axios from "axios";

export default class OrderService{
    static async getCurrent(){
       return await api.get('/orders/current')
    }
    static async addProduct(product_id){
        return await api.post('/orders/current', {
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
        return await api.delete(`/orders/products/${productId}`, )
    }
    static async deleteCurrent(){
        return await api.delete(`/orders/current`, )
    }
    static async changeQuantity(quantity, product_id){
        return await api.patch(`/orders/quantity`,{
            quantity: quantity,
            product_id: product_id
        } )
    }
}