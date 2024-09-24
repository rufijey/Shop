import React, {useEffect, useState} from 'react';
import cl from './ProductsSidebar.module.css'
import {useNavigate} from "react-router-dom";
import productStore from "../../../store/ProductStore";
import Filters from "../../Filters/Filters";
import {Scrollbars} from "react-custom-scrollbars-2";

const ProductsSidebar = () => {
    const navigate = useNavigate()

    const applyFilters = async ()=>{
        productStore.syncUrl()
        await productStore.fetchProducts()
    }

    const clearFilters = async() => {
        productStore.resetFilters()
        await productStore.fetchProducts()
    }

    return (
        <div className={cl.sidebar}>
            <div className={cl.main} onClick={applyFilters}>
                <h1 className={cl.item}>Filter</h1>
            </div>
            <div className={cl.items}>
                <Scrollbars
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                >
                    <Filters/>
                </Scrollbars>
            </div>
        </div>
    );
};

export default ProductsSidebar;