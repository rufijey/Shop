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
import ProductsList from "../../../../components/Product/List/ProductsList";


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
        productStore.syncReplaceUrl()
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
            <ProductsList
                link={'admin/products'}
            >
                <div>
                    <MdOutlineDriveFileRenameOutline
                        className={cl.change}
                        onClick={(e, product) => handleUpdateClick(e, product)}
                    />
                    <TiDelete
                        className={cl.delete}
                        onClick={(e, product) => handleDeleteClick(e, product)}
                    />
                </div>
            </ProductsList>
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
