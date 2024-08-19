import React from 'react';
import cl from './ProductsSidebar.module.css'
import {IoShirt} from "react-icons/io5";
import {FaTags} from "react-icons/fa6";
import {BiCategory} from "react-icons/bi";
import {useNavigate} from "react-router-dom";

const ProductsSidebar = () => {
    const navigate = useNavigate()
    return (
        <div className={cl.sidebar}>
            <div className={cl.main}>
                <h1 className={cl.item}>Filter</h1>
            </div>
            <div className={cl.items}>

            </div>
        </div>
    );
};

export default ProductsSidebar;