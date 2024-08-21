import React from 'react';
import CategorySelect from "./CategorySelect/CategorySelect";
import TagCheckboxSelect from "./TagSelect/TagCheckboxSelect";
import PriceRangeSlider from "./PriceRangeSlider/PriceRangeSlider";
import cl from './Filters.module.css'
import productStore from "../../store/ProductStore";
const Filters = () => {
    const applyFilters = async () => {
        productStore.syncUrl()
        await productStore.fetchProducts()
    }

    const clearFilters = async () => {
        productStore.resetFilters()
        await productStore.fetchProducts()
    }

    return (
        <div className={cl.items}>
            <div className={cl.categories}>
                <CategorySelect/>
            </div>
            <div className={cl.tags}>
                <TagCheckboxSelect/>
            </div>
            <div className={cl.slider}>
                <PriceRangeSlider/>
            </div>
            <div className={cl.filter__btns}>
                <div className={cl.filter__btn} onClick={applyFilters}>Apply</div>
                <div className={cl.filter__btn} onClick={clearFilters}>Clear</div>
            </div>
        </div>
    );
};

export default Filters;