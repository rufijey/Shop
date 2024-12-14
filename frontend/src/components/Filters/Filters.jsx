import React, {useEffect, useState} from 'react';
import CategorySelect from "./CategorySelect/CategorySelect";
import CharacteristicCheckboxSelect from "./CharacteristicSelect/CharacteristicCheckboxSelect";
import PriceRangeSlider from "./PriceRangeSlider/PriceRangeSlider";
import cl from './Filters.module.css'
import productStore from "../../store/ProductStore";
import CategoryService from "../../services/CategoryService";
import Loader from "../UI/loader/Loader";
import CharacteristicService from "../../services/CharacteristicService";
import ProductService from "../../services/ProductService";
import FilterStore from "../../store/FilterFetchingStore";
import {observer} from "mobx-react-lite";

const Filters = observer(() => {
    const [loading, setLoading] = useState(true)

    // const applyFilters = async () => {
    //     productStore.syncUrl()
    //     await productStore.fetchProducts()
    // }
    //
    // const clearFilters = async () => {
    //     productStore.resetFilters()
    //     await productStore.fetchProducts()
    // }


    useEffect(() => {
        FilterStore.fetchFilters().then(()=>{
            setLoading(FilterStore.totalLoading)
        })
    }, []);


    if (loading) {
        return (
            <div className={cl.loader}>
                <Loader/>
            </div>
        )
    }

    return (
        <div className={cl.items}>
            <div className={cl.slider}>
                <PriceRangeSlider/>
            </div>
            <div className={cl.categories}>
                <CategorySelect/>
            </div>
            <div className={cl.characteristics}>
                <CharacteristicCheckboxSelect/>
            </div>
            {/*<div className={cl.filter__btns}>*/}
            {/*    <div className={cl.filter__btn} onClick={applyFilters}>Apply</div>*/}
            {/*    <div className={cl.filter__btn} onClick={clearFilters}>Clear</div>*/}
            {/*</div>*/}
        </div>
    );
});

export default Filters;