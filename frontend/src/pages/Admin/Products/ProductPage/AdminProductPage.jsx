import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import ProductService from "../../../../services/ProductService";
import Loader from "../../../../components/UI/loader/Loader";
import cl from "./AdminProductPage.module.css";
import ImageGallery from "../../../../components/Product/ImageGallery/ImageGallery";
import {MdOutlineDriveFileRenameOutline} from "react-icons/md";
import {TiDelete} from "react-icons/ti";
import Modal from "../../../../components/UI/modal/Modal";
import ProductDelete from "../../../../components/Product/Delete/ProductDelete";

const AdminProductPage = () => {
    const params = useParams()
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [visibleDelete, setVisibleDelete] = useState(false)
    const navigate = useNavigate()

    const fetchProduct = async () => {
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
        fetchProduct()
    }, []);

    if (loading) {
        return (
            <Loader/>
        );
    }
    if (!product.slug) {
        return (
            <div>Error</div>
        );
    }

    function handleDeleteClick(e) {
        e.preventDefault()
        setVisibleDelete(true);
    }

    function handleUpdateClick() {
        navigate(`/admin/products/${product.slug}/update`)
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
            <div className={cl.buttons}>
                <MdOutlineDriveFileRenameOutline
                    className={cl.change}
                    onClick={handleUpdateClick}
                />
                <TiDelete
                    className={cl.delete}
                    onClick={handleDeleteClick}
                />
            </div>
            <Modal visible={visibleDelete} setVisible={setVisibleDelete}>
                <ProductDelete
                    setVisible={setVisibleDelete}
                    product={product}
                />
            </Modal>

        </div>
    );
};

export default AdminProductPage;