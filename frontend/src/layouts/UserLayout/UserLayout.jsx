import React from 'react';
import Navbar from "../../components/Bars/Navbar/Navbar";
import {Outlet} from "react-router-dom";
import cl from './UserLayout.module.css'

const UserLayout = () => {
    return (
        <div className={cl.container}>
            <Navbar classNames={cl.nav}/>
            <Outlet />
        </div>
    );
};

export default UserLayout;