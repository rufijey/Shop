import React, {useEffect, useState, useRef} from 'react';
import OrderService from "../../services/OrderService";
import cl from './CurrentOrder.module.css';
import {useNavigate} from "react-router-dom";
import {Scrollbars} from "react-custom-scrollbars-2";
import {MdDeleteForever} from "react-icons/md";
import authStore from "../../store/AuthStore";
import Loader from "../UI/loader/Loader";
import orderStore from "../../store/OrderStore";
import {FiMinus, FiPlus} from "react-icons/fi";
import {observer} from "mobx-react-lite";

const CurrentOrder = observer(({setVisibleModal}) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const updateTimeout = useRef({});

    const renderView = (props) => {
        return <div className={cl.customView} {...props} />;
    };

    const renderTrack = (props) => {
        return <div className={cl.customTrack} {...props} />;
    };

    const setProductQuantityWithDelay = (quantity, productId) => {
        if (updateTimeout.current[productId]) {
            clearTimeout(updateTimeout.current[productId]);
        }
        orderStore.setProductQuantity(quantity, productId);
        updateTimeout.current[productId] = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await OrderService.changeQuantity(quantity, productId);
                orderStore.setTotalPrice(res.data.total_price)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    const decrementQuantity = (product) => {
        if (product.quantity > 1) {
            setProductQuantityWithDelay(product.quantity - 1, product.id);
        }
    };

    const incrementQuantity = (product) => {
        if (product.quantity < product.total_quantity) {
            setProductQuantityWithDelay(product.quantity + 1, product.id);
        }
    };

    const handleComplete = async () => {
        const res = await OrderService.complete();
        orderStore.resetOrder();
        console.log(res);
    };

    if (orderStore.loading) {
        return (
            <div className={cl.loader}>
                <Loader/>
            </div>
        )
    }


    return (
        <div className={cl.container}>
            {orderStore.order.products && (
                <Scrollbars
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    renderView={renderView}
                    renderTrackHorizontal={renderTrack}
                >
                    {loading &&
                        <div className={cl.loader}>
                            <Loader/>
                        </div>
                    }
                    {orderStore.order.products.map(product => (
                        <div className={cl.product} key={product.id}>
                            <div className={cl.product__item}>
                                <div className={cl.image__container}>
                                    <img
                                        src={product.images[0].url}
                                        className={cl.image}
                                        alt={product.title}
                                        onClick={() => {
                                            navigate(`/products/${product.slug}`);
                                            setVisibleModal(false);
                                        }}
                                    />
                                </div>
                                <div className={cl.product__content}>
                                    <div className={cl.product__desc}>
                                        <div className={cl.title}>{product.title}</div>
                                        <div className={cl.price}>{product.price} ₴</div>
                                        <div className={cl.quantity__container}>
                                            <div
                                                onClick={() => decrementQuantity(product)}
                                                className={product.quantity > 1 ? cl.quantity__btn : [cl.quantity__btn, cl.disabled].join(' ')}
                                            >
                                                <FiMinus/>
                                            </div>
                                            <div className={cl.quantity}>{product.quantity}</div>
                                            <div
                                                onClick={() => incrementQuantity(product)}
                                                className={product.quantity < product.total_quantity ? cl.quantity__btn : [cl.quantity__btn, cl.disabled].join(' ')}
                                            >
                                                <FiPlus/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cl.order__btns}>
                                        <MdDeleteForever
                                            onClick={() => orderStore.removeProduct(product)}
                                            className={cl.delete__btn}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {orderStore.order.products[0] &&
                        <div className={cl.total__price}>{orderStore.order.total_price} ₴</div>
                    }
                    {orderStore.order.products[0] && authStore.isAuthenticated && (
                        <div className={cl.complete__btn} onClick={handleComplete}>
                            Complete order
                        </div>
                    )}
                </Scrollbars>
            )}
        </div>
    );
});

export default CurrentOrder;
