import React, {useEffect, useState} from 'react';
import Navbar from "../../components/Bars/Navbar/Navbar";
import {Outlet, useParams} from "react-router-dom";
import cl from './ProductPageLayout.module.css'
import ProductNav from "../../components/Product/ProductNav/ProductNav";
import ProductService from "../../services/ProductService";

const ProductPageLayout = () => {
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const params = useParams();

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const res = await ProductService.get(params.slug);
            setProduct(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [params.slug]);
    return (
        <div className={cl.container}>
            <Navbar classNames={cl.nav}/>
            <ProductNav slug={product.slug} link='products'/>
            <Outlet context={{loading, product, fetchProduct}}/>
        </div>
    );
};

export default ProductPageLayout;