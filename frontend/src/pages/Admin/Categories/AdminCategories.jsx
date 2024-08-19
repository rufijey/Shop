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

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleChange, setVisibleChange] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [categoryForChange, setCategoryForChange] = useState(null);
    const [categoryForDelete, setCategoryForDelete] = useState(null);

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
        fetchCategories();
    }, []);

    const handleEditClick = (category) => {
        setCategoryForChange(category);
        setVisibleChange(true);
    };

    const handleDeleteClick = (category) => {
        setCategoryForDelete(category);
        setVisibleDelete(true);
    };


    return (
        <div className={cl.container}>
            <div className={cl.categories}>
                <div className={cl.title}>Categories:</div>
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
                {loading && <Loader/>}
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
