import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import Loader from "../../../components/UI/loader/Loader"
import cl from './Products.module.css'
import Pagination from "../../../components/UI/pagination/Pagination";
import productStore from "../../../store/ProductStore";
import {observer} from "mobx-react-lite";
import ProductsList from "../../../components/Product/List/ProductsList";

const Products = observer(() => {
    const navigate = useNavigate()

    // useObserver(observedElement,page<totalPages, loading, ()=> {
    //     console.log(page+1)
    //     setPage(page + 1)
    // })

    useEffect(() => {
        productStore.syncReplaceUrl()
        productStore.fetchProducts()
    }, []);

    if (productStore.loading) {
        return (
            <Loader/>
        )
    }

    return (
        <div>
            <ProductsList
                link={'products'}
            ></ProductsList>
        </div>
    );
});

export default Products;