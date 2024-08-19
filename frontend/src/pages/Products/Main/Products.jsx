import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import ProductService from "../../../services/ProductService";
import {IoMdAddCircleOutline} from "react-icons/io";
import Loader from "../../../components/UI/loader/Loader";
import ProductDelete from "../../../components/Product/Delete/ProductDelete";
import Modal from "../../../components/UI/modal/Modal";
import {MdOutlineDriveFileRenameOutline} from "react-icons/md";
import {TiDelete} from "react-icons/ti";
import cl from './Products.module.css'
import {useObserver} from "../../../hooks/useObserver";
import {getPagesCount} from "../../../utils/pages";
import Pagination from "../../../components/UI/pagination/Pagination";
import productStore from "../../../store/ProductStore";
import {observer} from "mobx-react-lite";

const Products =  observer(() =>{
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const [totalPages, setTotalPages] = useState(0)
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(12);

    // useObserver(observedElement,page<totalPages, loading, ()=> {
    //     console.log(page+1)
    //     setPage(page + 1)
    // })

    useEffect(() => {
        productStore.syncUrl()
        productStore.fetchProducts();
    }, [page]);

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
                         onClick={() => navigate(`/products/${product.slug}`)}
                    >
                        <div className={cl.item__default}>
                            <div className={cl.image__container}>
                                <img src={product.images[0].url} className={cl.image} alt="huu"/>
                            </div>
                            <div>{product.title}</div>
                        </div>

                    </div>
                ))}
                {/*<div ref={observedElement} style={{height: 100, backgroundColor:"red", width:"100%"}}></div>*/}
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
        </div>
    );
});

export default Products;
