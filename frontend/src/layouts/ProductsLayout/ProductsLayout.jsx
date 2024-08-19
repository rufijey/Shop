import React from 'react';
import Navbar from "../../components/Bars/Navbar/Navbar";
import {Outlet} from "react-router-dom";
import cl from './ProductsLayout.module.css'
import ProductsSidebar from "../../components/Bars/ProductsSidebar/ProductsSidebar";

const UserLayout = () => {
    return (
        <div className={cl.container}>
            <div className={cl.sidebar}>
                <ProductsSidebar/>
            </div>
            <div className={cl.page__navbar}>
                <div className={cl.navbar}>
                    <Navbar/>
                </div>
                <Outlet/>
            </div>
        </div>
    );
};

export default UserLayout;