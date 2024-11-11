import React, {useEffect, useState} from "react";
import Loader from "../../../components/UI/loader/Loader";
import cl from './Products.module.css';
import productStore from "../../../store/ProductStore";
import {observer} from "mobx-react-lite";
import ProductsList from "../../../components/Product/List/ProductsList";

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
                <div className={cl.sortContainer}>
                    <select
                        className={cl.sortSelect}
                        value={productStore.sort}
                        onChange={handleSortChange}
                    >
                        <option value="created_at|desc">Date</option>
                        <option value="rating|desc">Rating</option>
                        <option value="price|asc">Price: Low to High</option>
                        <option value="price|desc">Price: High to Low</option>
                        <option value="title|asc">Title: A to Z</option>
                    </select>
                </div>
            }
            <ProductsList link={'products'}/>
        </div>
    );
});

export default Products;
