import React, {useEffect, useState} from 'react';
import cl from "./ProductItem.module.css";
import ImageGallery from "../ImageGallery/ImageGallery";
const ProductItem = ({children, product}) => {

    return (
        <div className={cl.container}>
            <div className={cl.product__container}>
                <ImageGallery images={product.images}/>
                <div className={cl.product}>
                    <div className={cl.product__about}>
                        <div className={cl.product__title}>{product.title}</div>
                        <div className={cl.buy}>
                            <div className={cl.price}>{product.price} ₴</div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            <div className={cl.product__description}>{product.description}</div>
        </div>
    );
};

export default ProductItem;