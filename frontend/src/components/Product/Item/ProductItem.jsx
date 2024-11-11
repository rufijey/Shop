import React, {useEffect, useState} from 'react';
import cl from "./ProductItem.module.css";
import ImageGallery from "../ImageGallery/ImageGallery";
import StarRatings from "react-star-ratings/build/star-ratings";
const ProductItem = ({children, product}) => {

    return (
        <div className={cl.container}>
            <div className={cl.product__container}>
                <ImageGallery images={product.images}/>
                <div className={cl.product}>
                    <div className={cl.product__about}>
                        <div className={cl.product__title}>{product.title}</div>
                        <StarRatings
                            rating={Number(product.rating)}
                            starRatedColor="#ffd700"
                            numberOfStars={5}
                            name='rating'
                            starDimension="24px"
                            starSpacing="0"
                        />

                        <div className={cl.price}>{product.price} ₴</div>
                        <div className={cl.buy}>
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