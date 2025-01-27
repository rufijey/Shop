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
import ProductItem from "../../../../components/Product/Item/ProductItem";

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
            <ProductItem
                product={product}
            />
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