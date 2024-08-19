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

const Products = () => {
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
    const [perPage, setPerPage] = useState(9);
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



    return (
        <div className={cl.container}>
            <div className={cl.products}>
                {products.map(product => (
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
                {loading && <Loader/>}
                <div ref={observedElement} style={{height: 1}}></div>
            </div>
        </div>
    );
};

export default Products;
