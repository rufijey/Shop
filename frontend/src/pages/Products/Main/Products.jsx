import React, {useEffect, useState} from "react";
import Loader from "../../../components/UI/loader/Loader";
import cl from './Products.module.css';
import productStore from "../../../store/ProductStore";
import {observer} from "mobx-react-lite";
import ProductsList from "../../../components/Product/List/ProductsList";
import ProductSortSelect from "../../../components/Product/SortSelect/ProductSortSelect";
import SelectedFilters from "../../../components/Filters/SelectedFilters/SelectedFilters";

const Products = observer(() => {
    const handleSortChange = async (e) => {
        const [field, direction] = e.target.value.split('|');
        await productStore.setSortBy(field, direction);
    };

    useEffect(() => {
        productStore.syncReplaceUrl();
        productStore.fetchProducts();
    }, []);

    if (productStore.loading) {
        return <Loader/>;
    }

    return (
        <div className={cl.container}>
            <div className={cl.filters}>
                <SelectedFilters/>
                <ProductSortSelect/>
            </div>
            <ProductsList link={'products'}/>
        </div>
    );
});

export default Products;
