import React from 'react';
import cl from './AdminSidebar.module.css'
import {IoShirt} from "react-icons/io5";
import {FaTags} from "react-icons/fa6";
import {BiCategory} from "react-icons/bi";
import {useNavigate} from "react-router-dom";

const AdminSidebar = () => {
    const navigate = useNavigate()
    return (
        <div className={cl.sidebar}>
            <div className={cl.main} onClick={() => navigate('/admin')}>
                <h1 className={cl.item}>Admin</h1>
            </div>
            <div className={cl.items}>
                <IoShirt className={cl.item} onClick={()=>navigate('/admin/products')}/>
                <BiCategory className={cl.item} onClick={()=>navigate('/admin/categories')}/>
                <FaTags className={cl.item} onClick={()=>navigate('/admin/tags')}/>
            </div>
        </div>
    );
};

export default AdminSidebar;