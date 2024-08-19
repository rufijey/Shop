import React from 'react';
import Navbar from "../../components/Bars/Navbar/Navbar";
import {Outlet} from "react-router-dom";
import AdminSidebar from "../../components/Bars/AdminSidebar/AdminSidebar";
import cl from './AdminLayout.module.css'

const UserLayout = () => {
    return (
        <div className={cl.container}>
            <div className={cl.sidebar}>
                <AdminSidebar/>
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