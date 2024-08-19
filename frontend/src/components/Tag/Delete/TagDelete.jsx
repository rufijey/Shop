import React from 'react';
import CustomButton from "../../UI/button/CustomButton";
import TagService from "../../../services/TagService";
import cl from './TagDelete.module.css'
const TagDelete = ({fetch, setVisible, tag}) => {
    const deleteCategory = (e)=>{
        e.preventDefault()
        TagService.delete(tag.id).then(res=>{
            setVisible(false)
            fetch()
        })
    }
    const back = (e)=>{
        e.preventDefault()
        setVisible(false)
    }
    return (
        <div className={cl.container}>
            <div className={cl.text}>Are you sure you want to delete <span className={cl.title}>{tag.title}</span> tag?</div>
            <div className={cl.buttons}>
                <CustomButton onClick={deleteCategory}>Yes</CustomButton>
                <CustomButton onClick={back}>No</CustomButton>
            </div>
        </div>
    );
};

export default TagDelete;