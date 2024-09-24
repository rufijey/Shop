import React, {useEffect, useState} from 'react';
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import cl from "./ProductPage.module.css";
import ProductService from "../../../services/ProductService";
import Loader from "../../../components/UI/loader/Loader";
import ImageGallery from "../../../components/Product/ImageGallery/ImageGallery";
import {FaCartShopping} from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import OrderService from "../../../services/OrderService";
import Alert from "../../../components/UI/alert/Alert";
import ProductItem from "../../../components/Product/Item/ProductItem";
import orderStore from "../../../store/OrderStore";
import {observer} from "mobx-react-lite";
import ProductNav from "../../../components/Product/ProductNav/ProductNav";

const ProductPage = observer(() => {
    const { product, loading } = useOutletContext();
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

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
        <div>
            <ProductItem
                product={product}
            >
                { orderStore.isOrdered(product.id)
                    ? <div className={[cl.cart__container, cl.added].join(' ')} onClick={() => orderStore.setVisible(true)}>
                        <FaCheck/>
                        <div>Added to cart</div>
                    </div>
                    : <div className={cl.cart__container} onClick={() => orderStore.addProduct(setShowAlert, product)}>
                        <FaCartShopping/>
                        <div>Add to cart</div>
                    </div>
                }

            </ProductItem>
            {
                showAlert && (
                    <Alert
                        className={cl.alert}
                        message="Product added to cart!"
                        onClose={() => setShowAlert(false)}
                    />
                )
            }
        </div>
    )
        ;
});

export default ProductPage;
