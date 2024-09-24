import React, { useEffect, useState } from 'react';
import CategoryService from "../../../services/CategoryService";
import cl from './AdminCategories.module.css';
import { TiDelete } from "react-icons/ti";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import Modal from "../../../components/UI/modal/Modal";
import CategoryPostForm from "../../../components/Category/PostForm/CategoryPostForm";
import CategoryUpdateForm from "../../../components/Category/UpdateForm/CategoryUpdateForm";
import CategoryDelete from "../../../components/Category/Delete/CategoryDelete";
import Loader from "../../../components/UI/loader/Loader";
import CustomInput from "../../../components/UI/input/CustomInput";
import {FaSearch} from "react-icons/fa";

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleChange, setVisibleChange] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [categoryForChange, setCategoryForChange] = useState(null);
    const [categoryForDelete, setCategoryForDelete] = useState(null);
    const [categoryTitle, setCategoryTitle] = useState(''); // Стейт для фильтра

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await CategoryService.getAll(categoryTitle); // Передаем параметр title для фильтрации
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(); // Загружаем категории при загрузке компонента
    }, []);

    const handleEditClick = (category) => {
        setCategoryForChange(category);
        setVisibleChange(true);
    };

    const handleDeleteClick = (category) => {
        setCategoryForDelete(category);
        setVisibleDelete(true);
    };

    const handleSearchSubmit = () => {
        fetchCategories(categoryTitle);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchSubmit();
        }
    };

    return (
        <div className={cl.container}>
            <div className={cl.categories__container}>

                <div className={cl.search}>
                    <CustomInput
                        value={categoryTitle}
                        onChange={e => setCategoryTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <FaSearch className={cl.search__icon} onClick={handleSearchSubmit}/>
                </div>
                <div className={cl.categories}>
                    {categories.map(category => (
                        <div className={cl.category__item} key={category.id}>
                            <div>{category.title}</div>
                            <div>
                                <MdOutlineDriveFileRenameOutline
                                    className={cl.change}
                                    onClick={() => handleEditClick(category)}
                                />
                                <TiDelete
                                    className={cl.tip}
                                    onClick={() => handleDeleteClick(category)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {loading && <Loader />}
            </div>

            <IoMdAddCircleOutline
                className={cl.add}
                onClick={() => setVisibleAdd(true)}
            />
            <Modal visible={visibleAdd} setVisible={setVisibleAdd}>
                <CategoryPostForm fetch={fetchCategories} setVisible={setVisibleAdd} />
            </Modal>
            <Modal visible={visibleChange} setVisible={setVisibleChange}>
                {categoryForChange && (
                    <CategoryUpdateForm
                        fetch={fetchCategories}
                        setVisible={setVisibleChange}
                        category={categoryForChange}
                    />
                )}
            </Modal>
            <Modal visible={visibleDelete} setVisible={setVisibleDelete}>
                {categoryForDelete && (
                    <CategoryDelete
                        fetch={fetchCategories}
                        setVisible={setVisibleDelete}
                        category={categoryForDelete}
                    />
                )}
            </Modal>
        </div>
    );
};

export default AdminCategories;
