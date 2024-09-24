import {makeAutoObservable} from 'mobx';
import OrderService from "../services/OrderService";
import router from "../router";
import authStore from "./AuthStore";
import Cookies from "js-cookie";
import {v4} from "uuid";
import products from "../pages/Products/Main/Products";


class OrderStore {
    order = {
        products: [{
            images: [],
            title: '',
            price: 0,
            id: 0,
        }],
        products_quantity: null,
        total_price: null
    }
    loading = true
    visible = false
    constructor() {
        makeAutoObservable(this);
        this.fetchCurrentOrder()
    }

    fetchCurrentOrder = async () => {
        try {
            this.setLoading(true)
            const res = await OrderService.getCurrent()
            this.setOrder(res.data)
        } catch (err) {
            console.error(err.message)
        } finally {
            this.setLoading(false)
        }
    }

    removeProduct = async (product) => {
        try {
            await OrderService.removeProduct(product.id);
        } catch (err) {
            console.error(err)
        }
        await this.fetchCurrentOrder()
    }
    addProduct = async (setShowAlert, product) => {
        setShowAlert(false);
        try {
            if(!authStore.isAuthenticated && !Cookies.get('guest_id')){
                const uniqueId = v4();
                Cookies.set('guest_id', uniqueId, { expires: 3650, path: '/' });
            }
            const res = await OrderService.addProduct(product.id);
            setShowAlert(true);
            await this.fetchCurrentOrder()
        } catch (error) {
            console.error(error.message);
        }
    };
    resetOrder(){
        this.order = {
            products: [],
            products_quantity: null,
            total_price: null
        }
    }
    setLoading(loading) {
        this.loading = loading
    }
    setVisible = (visible)=>{
        this.visible = visible
    }

    setOrder(order) {
        this.order = order
    }
    setProductQuantity = (quantity, productId) => {
        const product = this.order.products.find(p => p.id === productId);
        if (product) {
            this.order.products_quantity = Number(this.order.products_quantity) + Number(quantity) - Number(product.quantity);
            console.log(this.order.products_quantity)
            product.quantity = quantity;
        }
    }
    isOrdered(productId){
        if(!this.order){
            return false
        }
        return this.order.products.some(product => product.id === productId )
    }

}

const orderStore = new OrderStore();
export default orderStore;
