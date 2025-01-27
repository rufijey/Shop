import React, {useEffect} from 'react';
import productStore from "../../../store/ProductStore";
import cl from "./ProductSortSelect.module.css";
import {observer} from "mobx-react-lite";

const ProductSortSelect = observer(() => {

    const handleSortChange = async (e) => {
        const [field, direction] = e.target.value.split('|');
        await productStore.setSortBy(field, direction);
    };

    useEffect(() => {
        productStore.syncReplaceUrl();
    })
    return (
        <div>
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
        </div>
    );
});

export default ProductSortSelect;