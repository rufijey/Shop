import React from 'react';
import CustomButton from "../../UI/button/CustomButton";
import CategoryService from "../../../services/CategoryService";
import cl from './CategoryDelete.module.css'
const CategoryDelete = ({fetch, setVisible, category}) => {
    const deleteCategory = async (e)=>{
        try {
            await CategoryService.delete(category.id)
            setVisible(false)
            fetch()
        }catch (err){
        }
    }
    const back = (e)=>{
        e.preventDefault()
        setVisible(false)
    }
    return (
        <div className={cl.container}>
            <div className={cl.text}>Are you sure you want to delete <span className={cl.title}>{category.title}</span> category?</div>
            <div className={cl.buttons}>
                <CustomButton onClick={deleteCategory}>Yes</CustomButton>
                <CustomButton onClick={back}>No</CustomButton>
            </div>
        </div>
    );
};

export default CategoryDelete;