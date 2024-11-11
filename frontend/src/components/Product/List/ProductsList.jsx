import React, { useState } from 'react';
import cl from './ProductsList.module.css';
import productStore from "../../../store/ProductStore";
import Pagination from "../../UI/pagination/Pagination";
import { useNavigate } from "react-router-dom";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import StarRatings from "react-star-ratings/build/star-ratings";

const ProductsList = ({ link, updateClick, deleteClick }) => {
    const navigate = useNavigate();

    return (
        <div className={cl.container}>
            <div className={cl.products}>
                {productStore.products.map(product => (
                    <div className={cl.product}
                         key={product.id}
                         onClick={() => navigate(`/${link}/${product.slug}`)}
                    >
                        <div className={cl.product__item}>
                            <div className={cl.image__container}>
                                <img src={product.images[0].url} className={cl.image} alt="huu"/>
                            </div>
                            <div className={cl.title}>{product.title}</div>
                            <div className={cl.price__rating}>
                                <div className={cl.price}>{product.price} ₴</div>
                                <StarRatings
                                    rating={Number(product.rating)}
                                    starRatedColor="#ffd700"
                                    numberOfStars={5}
                                    name='rating'
                                    starDimension="18px"
                                    starSpacing="0"
                                />
                            </div>
                            {updateClick && deleteClick &&
                                <div>
                                    <MdOutlineDriveFileRenameOutline
                                        className={cl.change}
                                        onClick={(e) => updateClick(e, product)}
                                    />
                                    <TiDelete
                                        className={cl.delete}
                                        onClick={(e) => deleteClick(e, product)}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                ))}
                {productStore.totalPages > 1 &&
                    <div className={cl.wrapper}>
                        <Pagination
                            page={productStore.filters.page}
                            changePage={productStore.setPage}
                            totalPages={productStore.totalPages}
                        />
                    </div>
                }
            </div>
        </div>
    );
};

export default ProductsList;
