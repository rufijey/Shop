import React, {useEffect, useState} from 'react';
import cl from './ProductsSidebar.module.css'
import {IoShirt} from "react-icons/io5";
import {FaTags} from "react-icons/fa6";
import {BiCategory} from "react-icons/bi";
import {useNavigate} from "react-router-dom";
import CategoryService from "../../../services/CategoryService";
import CustomSelect from "../../UI/select/CustomSelect";
import productStore from "../../../store/ProductStore";
import TagSelector from "../../Tag/Selector/TagSelector";
import TagCheckboxSelect from "../../Filters/TagSelect/TagCheckboxSelect";
import CategorySelect from "../../Filters/CategorySelect/CategorySelect";
import PriceRangeSlider from "../../Filters/PriceRangeSlider/PriceRangeSlider";
import Filters from "../../Filters/Filters";

const ProductsSidebar = () => {
    const navigate = useNavigate()

    const applyFilters = async ()=>{
        productStore.syncUrl()
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
                <Filters/>
            </div>
        </div>
    );
};

export default ProductsSidebar;