import React, {useEffect, useState} from 'react';
import OrderService from "../../services/OrderService";
import cl from './CurrentOrder.module.css'
import {useNavigate} from "react-router-dom";
import {Scrollbars} from "react-custom-scrollbars-2";
import {MdDeleteForever} from "react-icons/md";
import authStore from "../../store/AuthStore";
import products from "../../pages/Products/Main/Products";
import Loader from "../UI/loader/Loader";
import orderStore from "../../store/OrderStore";
import { FiMinus } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import {observer} from "mobx-react-lite";

const CurrentOrder = observer(({setVisibleModal}) => {

    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    let times = 0

    const renderView = (props) => {
        return <div className={cl.customView} {...props} />;
    };

    let updateTimeout = null;

    const setProductQuantityWithDelay = (quantity, productId) => {
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }
        orderStore.setProductQuantity(quantity, productId);
        updateTimeout = setTimeout(async () => {
            const res = await OrderService.changeQuantity(quantity, productId)
        }, 1000);
    }

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


    if (orderStore.loading) {
        return (
            <div className={cl.loader}>
                <Loader />
            </div>
        );
    }

    return (
        <div className={cl.container}>
            {orderStore.order.products &&
                <Scrollbars
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    renderView={renderView}
                >
                    {orderStore.order.products.map(product => (
                        <div
                            className={cl.product}
                            key={product.id}
                        >
                            <div className={cl.product__item}>
                                <div
                                    className={cl.image__container}
                                >
                                    <img src={product.images[0].url} className={cl.image} alt="huu"
                                         onClick={() => {
                                             navigate(`/products/${product.slug}`)
                                             setVisibleModal(false)
                                         }}
                                    />
                                </div>
                                <div className={cl.product__content}>
                                    <div className={cl.product__desc}>
                                        <div className={cl.title}>{product.title}</div>
                                        <div className={cl.price}>{product.price} ₴</div>
                                        <div className={cl.quantity__container}>
                                            <div onClick={()=>decrementQuantity(product)}
                                                 className={product.quantity > 1? cl.quantity__btn : [cl.quantity__btn, cl.disabled].join(' ')}
                                            ><FiMinus/></div>
                                            <div className={cl.quantity}>{product.quantity}</div>
                                            <div onClick={()=>incrementQuantity(product)}
                                                 className={product.quantity < product.total_quantity? cl.quantity__btn : [cl.quantity__btn, cl.disabled].join(' ')}
                                            ><FiPlus/></div>
                                        </div>
                                    </div>
                                    <div className={cl.order__btns}>
                                        <MdDeleteForever
                                            onClick={() => orderStore.removeProduct(product)}
                                            className={cl.delete__btn}/>
                                    </div>
                                </div>

                            </div>

                        </div>
                    ))}
                    <div></div>
                </Scrollbars>
            }
        </div>
    );
});

export default CurrentOrder;