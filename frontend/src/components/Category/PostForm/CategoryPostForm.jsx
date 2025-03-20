import React, {useState} from 'react';
import CustomInput from "../../UI/input/CustomInput";
import CustomButton from "../../UI/button/CustomButton";
import CategoryService from "../../../services/CategoryService";

const CategoryPostForm = ({fetch, setVisible}) => {
    const [categoryTitle, setCategoryTitle] = useState('');
    const addNewCategory = async (e) => {
        e.preventDefault();
        try {
            await CategoryService.post(categoryTitle)
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
                <CustomButton onClick={addNewCategory}>Submit</CustomButton>
            </form>
        </div>
    );
};

export default CategoryPostForm;