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
import productStore from "../../../../store/ProductStore";
import Pagination from "../../../../components/UI/pagination/Pagination";
import {observer} from "mobx-react-lite";


const AdminProducts = observer(() => {
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
    const [perPage, setPerPage] = useState(12);

    // useObserver(observedElement,page<totalPages, loading, ()=> {
    //     setPage(page + 1)
    // })

    useEffect(() => {
        productStore.syncUrl()
        productStore.fetchProducts();
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

    if(productStore.loading){
        return (
            <Loader/>
        )
    }

    return (
        <div className={cl.container}>
            <div className={cl.products}>
                {productStore.products.map(product => (
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
                {/*<div ref={observedElement} style={{height: 1}}></div>*/}
                {productStore.totalPages > 1 &&
                    <div className={cl.wrapper}>
                        <Pagination
                            page={productStore.filters.page}
                            changePage={productStore.setPage}
                            totalPages={productStore.totalPages}
                        />
                    </div>
                }
            </div>
            <IoMdAddCircleOutline
                className={cl.add}
                onClick={() => navigate('/admin/products/post')}
            />

            <Modal visible={visibleDelete} setVisible={setVisibleDelete}>
                {productForDelete && (
                    <ProductDelete
                        fetch={productStore.fetchProducts}
                        setVisible={setVisibleDelete}
                        product={productForDelete}
                    />
                )}
            </Modal>
        </div>
    );
});

export default AdminProducts;
