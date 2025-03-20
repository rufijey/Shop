import React, {useEffect, useState} from 'react';
import CustomInput from "../../UI/input/CustomInput";
import CustomButton from "../../UI/button/CustomButton";
import CategoryService from "../../../services/CategoryService";

const CategoryUpdateForm = ({fetch, setVisible, category}) => {
    const [categoryTitle, setCategoryTitle] = useState('');
    useEffect(() => {
        setCategoryTitle(category.title)
    }, []);
    const UpdateCategory = async (e) => {
        e.preventDefault();
        try {
            await CategoryService.update(categoryTitle)
            setVisible(false)
            fetch()
        }catch (err){
            if (err.response.message) {
                alert(err.response.message)
            }
        }
    }

    return (
        <div>
            <form>
                <CustomInput onChange={e => setCategoryTitle(e.target.value)} value={categoryTitle} type="text"
                             placeholder="Category title"/>
                <CustomButton onClick={UpdateCategory}>Submit</CustomButton>
            </form>
        </div>
    );
};

export default CategoryUpdateForm;