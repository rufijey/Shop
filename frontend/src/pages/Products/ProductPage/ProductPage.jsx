import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import cl from "./ProductPage.module.css";
import ProductService from "../../../services/ProductService";
import Loader from "../../../components/UI/loader/Loader";
import ImageGallery from "../../../components/Product/ImageGallery/ImageGallery";
import { FaCartShopping } from "react-icons/fa6";
import OrderService from "../../../services/OrderService";
import Alert from "../../../components/UI/alert/Alert";

const ProductPage = () => {
    const params = useParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false); // состояние для показа алерта
    const navigate = useNavigate();

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
    };

    useEffect(() => {
        fetchProducts();
    }, [params.slug]);

    if (loading) {
        return (
            <div className={cl.loader}>
                <Loader />
            </div>
        );
    }

    if (!product.slug) {
        return (
            <div>Error</div>
        );
    }

    const handleCartClick = async () => {
        try {
            const res = await OrderService.addProduct(product.id);
            console.log(res);
            setShowAlert(true); // Показываем алерт
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className={cl.container}>
            <div className={cl.category}>{product.category.title}</div>
            <div className={cl.product__container}>
                <ImageGallery images={product.images} />
                <div className={cl.product}>
                    <div className={cl.product__title}>{product.title}</div>
                    <div className={cl.product__about}>
                        <div className={cl.buy}>
                            <div className={cl.price}>{product.price} ₴</div>
                            <div className={cl.cart__container} onClick={handleCartClick}>
                                <FaCartShopping /> <div>Add to cart</div>
                            </div>
                        </div>
                        <div className={cl.product__description}>{product.description}</div>
                    </div>
                </div>
            </div>
            {product.tags[0] ? (
                <div className={cl.tags__container}>
                    <div className={cl.tags}>
                        {product.tags.map((tag) => (
                            <div key={tag.id} className={cl.tag}>
                                # {tag.title}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={cl.no__tags}></div>
            )}
            {showAlert && (
                <Alert
                    className={cl.alert}
                    message="Product added to cart!"
                    onClose={() => setShowAlert(false)}
                />
            )}
        </div>
    );
};

export default ProductPage;
