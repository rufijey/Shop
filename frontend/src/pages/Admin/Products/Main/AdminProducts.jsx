import React, {useEffect, useRef, useState} from 'react';
import ProductService from "../../../../services/ProductService";
import cl from './AdminProducts.module.css';
import {TiDelete} from "react-icons/ti";
import {IoMdAddCircleOutline} from "react-icons/io";
import {MdOutlineDriveFileRenameOutline} from "react-icons/md";
import Modal from "../../../../components/UI/modal/Modal";
import ProductDelete from "../../../../components/Product/Delete/ProductDelete";
import {useNavigate} from "react-router-dom";
import Loader from "../../../../components/UI/loader/Loader";
import {useObserver} from "../../../../hooks/useObserver";
import {getPagesCount} from "../../../../utils/pages";


const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [productForChange, setProductForChange] = useState(null);
    const [productForDelete, setProductForDelete] = useState(null);
    const navigate = useNavigate()
    const [totalPages, setTotalPages] = useState(0)
    const observedElement = useRef(null)
    const observer = useRef()
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(6);
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await ProductService.getAll(page, perPage);
            setProducts([...products, ...res.data]);
            const totalCount = res.headers['x-total-count']
            setTotalPages(getPagesCount(totalCount, perPage));
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useObserver(observedElement,page<totalPages, loading, ()=> {
        setPage(page + 1)
    })

    useEffect(() => {
        fetchProducts();
    }, [page]);


    const handleDeleteClick = (product, e) => {
        e.stopPropagation()
        setProductForDelete(product);
        setVisibleDelete(true);
    }
    function handleUpdateClick(product, e) {
        e.stopPropagation()
        navigate(`/admin/products/${product.slug}/update`)
    }


    return (
        <div className={cl.container}>
            <div className={cl.products}>
                {products.map(product => (
                    <div className={cl.product__item}
                         key={product.id}
                         onClick={() => navigate(`/admin/products/${product.slug}`)}
                    >
                        <div className={cl.item__default}>
                            <div className={cl.image__container}>
                                <img src={product.images[0].url} className={cl.image} alt="huu"/>
                            </div>
                            <div>{product.title}</div>
                            <div>
                                <MdOutlineDriveFileRenameOutline
                                    className={cl.change}
                                    onClick={e => handleUpdateClick(product, e)}
                                />
                                <TiDelete
                                    className={cl.delete}
                                    onClick={e => handleDeleteClick(product, e)}
                                />
                            </div>
                        </div>

                    </div>
                ))}
                {loading && <Loader/>}
                <div ref={observedElement} style={{height: 1}}></div>
            </div>
            <IoMdAddCircleOutline
                className={cl.add}
                onClick={() => navigate('/admin/products/post')}
            />

            <Modal visible={visibleDelete} setVisible={setVisibleDelete}>
                {productForDelete && (
                    <ProductDelete
                        fetch={fetchProducts}
                        setVisible={setVisibleDelete}
                        product={productForDelete}
                    />
                )}
            </Modal>
        </div>
    );
};

export default AdminProducts;
