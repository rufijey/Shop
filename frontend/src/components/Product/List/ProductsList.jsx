import React from 'react';
import cl from './ProductsList.module.css';
import productStore from "../../../store/ProductStore";
import Pagination from "../../UI/pagination/Pagination";
import {useNavigate} from "react-router-dom";

const ProductsList = ({children, link}) => {
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
                            <div className={cl.price}>{product.price} ₴</div>
                            {React.Children.map(children, child => {
                                return React.cloneElement(child, { product });
                            })}
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
