import React, {useEffect, useState} from 'react';
import cl from './ProductsSidebar.module.css'
import {IoShirt} from "react-icons/io5";
import {FaTags} from "react-icons/fa6";
import {BiCategory} from "react-icons/bi";
import {useNavigate} from "react-router-dom";
import CategoryService from "../../../services/CategoryService";
import CustomSelect from "../../UI/select/CustomSelect";
import productStore from "../../../store/ProductStore";
import TagSelector from "../../Tag/Selector/TagSelector";
import CheckboxList from "../../UI/checkboxSelect/CheckboxList";

const ProductsSidebar = () => {
    const navigate = useNavigate()
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await CategoryService.getAll();
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCategories()
    }, []);
    return (
        <div className={cl.sidebar}>
            <div className={cl.main}>
                <h1 className={cl.item}>Filter</h1>
            </div>
            <div className={cl.items}>
                <div className={cl.tags}>
                    <CheckboxList/>
                </div>
            </div>
        </div>
    );
};

export default ProductsSidebar;