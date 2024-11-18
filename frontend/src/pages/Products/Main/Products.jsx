import React, {useEffect, useState} from "react";
import Loader from "../../../components/UI/loader/Loader";
import cl from './Products.module.css';
import productStore from "../../../store/ProductStore";
import {observer} from "mobx-react-lite";
import ProductsList from "../../../components/Product/List/ProductsList";
import ProductSortSelect from "../../../components/Product/SortSelect/ProductSortSelect";

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
            {productStore.filters.sort_by &&
               <ProductSortSelect/>
            }
            <ProductsList link={'products'}/>
        </div>
    );
});

export default Products;
