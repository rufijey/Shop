import React, {useEffect, useState} from 'react';
import cl from "./ProductItem.module.css";
import ImageGallery from "../ImageGallery/ImageGallery";
import StarRatings from "react-star-ratings/build/star-ratings";
import ExpandableText from "../../UI/expandableText/ExpandableText";
const ProductItem = ({children, product}) => {

    return (
        <div className={cl.container}>
            <div className={cl.product__container}>
                <ImageGallery images={product.images}/>
                <div className={cl.product}>
                    <div className={cl.product__about}>
                        <div className={cl.product__title}>{product.title}</div>
                        <div className={cl.rating}>
                            <StarRatings
                                rating={Number(product.rating)}
                                starRatedColor="#ffd700"
                                numberOfStars={5}
                                name='rating'
                                starDimension="30px"
                                starSpacing="0"
                            />
                            <span className={cl.reviews_count}>
                                {product.reviews_count}
                            </span>
                        </div>
                        <div className={cl.buy__info}>
                            <div className={cl.price}>{product.price} ₴</div>
                            <div className={cl.buy}>
                                {children}
                            </div>
                        </div>
                        <div className={cl.description}>Description:</div>
                        {/*<div className={cl.product__description}>{product.description}</div>*/}
                        <ExpandableText text={product.description} maxLength={300} />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProductItem;