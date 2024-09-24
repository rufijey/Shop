import React, {useEffect, useState} from 'react';
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import cl from "./ProductAbout.module.css";
import Loader from "../../../components/UI/loader/Loader";
import {observer} from "mobx-react-lite";
import ImageGallery from "../../../components/Product/ImageGallery/ImageGallery";
import productStore from "../../../store/ProductStore";

const ProductPage = observer(() => {
    const {product, loading} = useOutletContext();
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        productStore.setFilter('category_id', category.id)
        navigate('/products')
    }

    const handleTagClick = (tag) => {
        productStore.setFilter('tag_ids', [tag.id])
        navigate('/products')
    }

    if (loading) {
        return (<div className={cl.loader}>
            <Loader/>
        </div>);
    }

    if (!product.slug) {
        return (<div>Error</div>);
    }

    return (
        <div>
            <div className={cl.product}>
                <div className={cl.product__about}>
                    <div className={cl.product__title}>{product.title}</div>
                    <div className={cl.price}>{product.price} ₴</div>
                    <div className={cl.product__description}>{product.description}</div>
                    <div className={cl.product__category}
                         onClick={() => handleCategoryClick(product.category)}
                    >{product.category.title}</div>
                </div>
                <div className={cl.product__image}>
                    <img
                        src={product.images[0].url}
                        alt="Main"
                    />
                </div>
            </div>

            {product.tags[0]
                ? (<div className={cl.tags__container}>
                    <div className={cl.tags}>
                        {product.tags.map((tag) => (
                            <div key={tag.id} className={cl.tag}
                                 onClick={() => handleTagClick(tag)}
                            >
                                # {tag.title}
                            </div>
                        ))}
                    </div>
                </div>)
                : (<div className={cl.no__tags}></div>
                )}
        </div>
    )
});

export default ProductPage;
