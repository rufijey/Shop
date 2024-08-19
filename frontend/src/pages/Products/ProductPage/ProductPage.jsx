import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import cl from "./ProductPage.module.css";
import ProductService from "../../../services/ProductService";
import Loader from "../../../components/UI/loader/Loader";
import ImageGallery from "../../../components/Product/ImageGallery/ImageGallery";


const ProductPage = () => {
    const params = useParams()
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await ProductService.get(params.slug);
            setProduct(res.data);
        } catch (error) {
            console.log("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchProducts()
    }, []);

    if (loading) {
        return (
            <div className={cl.loader}>
                <Loader/>
            </div>
        );
    }
    if (!product.slug) {
        return (
            <div>Error</div>
        );
    }
    return (
        <div className={cl.container}>
            <div className={cl.category}>{product.category.title}</div>
            <div className={cl.product__container}>
                <ImageGallery images={product.images}/>
                <div className={cl.product}>
                    <div className={cl.product__title}>{product.title}</div>
                    <div className={cl.product__about}>
                        <div className={cl.price}>{product.price} ₴</div>
                        <div className={cl.product__description}>{product.description}</div>
                    </div>
                </div>
            </div>
            {product.tags[0]
                ? <div className={cl.tags__container}>
                    <div className={cl.tags}>
                        {product.tags.map(tag => (
                            <div key={tag.id} className={cl.tag}>
                                # {tag.title}
                            </div>
                        ))}
                    </div>
                </div>
                : <div className={cl.no__tags}></div>
            }
        </div>
    );
};

export default ProductPage;