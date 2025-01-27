import React, {useEffect} from 'react';
import cl from '../Sidebar.module.css'
import { MdMonitor } from "react-icons/md";
import {FaTags} from "react-icons/fa6";
import {BiCategory} from "react-icons/bi";
import {useNavigate} from "react-router-dom";
import CategorySelect from "../../Filters/CategorySelect/CategorySelect";
import CharacteristicCheckboxSelect from "../../Filters/CharacteristicSelect/CharacteristicCheckboxSelect";
import PriceRangeSlider from "../../Filters/PriceRangeSlider/PriceRangeSlider";
import productStore from "../../../store/ProductStore";
import Filters from "../../Filters/Filters";
import {Scrollbars} from "react-custom-scrollbars-2";

const AdminSidebar = () => {
    const navigate = useNavigate()
    return (
        <div className={cl.sidebar}>
            <div className={cl.main}>
                <h1 className={cl.item} onClick={() => navigate('/admin')}>Admin</h1>
            </div>
            <div className={cl.items}>
                <Scrollbars
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                >
                <div className={cl.links}>
                    <MdMonitor className={cl.item} onClick={() => navigate('/admin/products')}/>
                    <BiCategory className={cl.item} onClick={() => navigate('/admin/categories')}/>
                    <FaTags className={cl.item} onClick={() => navigate('/admin/characteristics')}/>
                </div>
                {
                    window.location.pathname === '/admin/products' &&
                    <Filters/>
                }
                </Scrollbars>

            </div>
        </div>
    );
};

export default AdminSidebar;