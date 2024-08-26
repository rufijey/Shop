import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import Loader from "../../../components/UI/loader/Loader"
import cl from './Products.module.css'
import Pagination from "../../../components/UI/pagination/Pagination";
import productStore from "../../../store/ProductStore";
import {observer} from "mobx-react-lite";

const Products = observer(() => {
    const navigate = useNavigate()

    // useObserver(observedElement,page<totalPages, loading, ()=> {
    //     console.log(page+1)
    //     setPage(page + 1)
    // })

    useEffect(() => {
        productStore.syncUrl()
        productStore.fetchProducts()
    }, []);

    if (productStore.loading) {
        return (
            <Loader/>
        )
    }

    return (
        <div className={cl.container}>
            <div className={cl.products}>
                {productStore.products.map(product => (
                    <div className={cl.product__item}
                         key={product.id}
                         onClick={() => navigate(`/products/${product.slug}`)}
                    >
                        <div className={cl.item__default}>
                            <div className={cl.image__container}>
                                <img src={product.images[0].url} className={cl.image} alt="huu"/>
                            </div>
                            <div>{product.title}</div>
                            <div className={cl.price}>{product.price} ₴</div>
                        </div>

                    </div>
                ))}
                {/*<div ref={observedElement} style={{height: 100, backgroundColor:"red", width:"100%"}}></div>*/}
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
});

export default Products;