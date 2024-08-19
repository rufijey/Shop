import React from 'react';
import CustomButton from "../../UI/button/CustomButton";
import ProductService from "../../../services/ProductService";
import cl from './ProductDelete.module.css'
import {useLocation, useNavigate} from "react-router-dom";
const ProductDelete = ({fetch, setVisible, product}) => {
    const navigate = useNavigate()
    const location = useLocation();

    const deleteProduct = (e)=>{
        e.preventDefault()
        ProductService.delete(product.slug).then(res=>{
            setVisible(false)
            fetch()
        })
        if(location.pathname !== '/admin/products'){
            navigate('/admin/products')
        }
    }
    const back = (e)=>{
        e.preventDefault()
        setVisible(false)
    }
    return (
        <div className={cl.container}>
            <div className={cl.text}>Are you sure you want to delete <span className={cl.title}>{product.title}</span> product?</div>
            <div className={cl.buttons}>
                <CustomButton onClick={deleteProduct}>Yes</CustomButton>
                <CustomButton onClick={back}>No</CustomButton>
            </div>
        </div>
    );
};

export default ProductDelete;