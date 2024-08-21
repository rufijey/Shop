import React, {useEffect, useState} from 'react';
import { FaAngleDown, FaAngleUp, FaSearch } from "react-icons/fa";
import cl from './CategorySelect.module.css';
import CategoryService from "../../../services/CategoryService";
import Loader from "../../UI/loader/Loader";
import productStore from "../../../store/ProductStore";
import { observer } from "mobx-react-lite";
import CustomInput from "../../UI/input/CustomInput";

const CategorySelect = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoryTitle, setCategoryTitle] = useState('');

    const fetchCategories = async (title) => {
        try {
            setCategoriesLoading(true);
            const res = await CategoryService.getAll(title);
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setCategoriesLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories()
    }, []);

    const toggleList = () => {
        // if (!categories[0]) {
        //     fetchCategories().then(() => {
        //         setIsOpen(!isOpen);
        //     });
        // } else {
        //     setIsOpen(!isOpen);
        // }
        setIsOpen(!isOpen);
    };

    const handleCheckboxChange = (event, categoryId) => {
        if (event.target.checked) {
            productStore.setFilter('category_id', categoryId)
        } else {
            productStore.setFilter('category_id', null)
        }
    };

    const handleCategoryKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleCategorySearchSubmit();
        }
    };

    const handleCategorySearchSubmit = async () => {
        await fetchCategories(categoryTitle);
    };

    return (
        <div className={cl.container}>
            <div className={cl.select}>
                <div onClick={toggleList} className={cl.categoriesOpen}>
                    <div>Category</div>
                    {isOpen ? <FaAngleUp className={cl.arrow}/> : <FaAngleDown className={cl.arrow}/>}
                </div>

                {isOpen && (
                    <div className={cl.categories}>
                        {categoriesLoading &&
                            <div className={cl.loader}>
                                <Loader/>
                            </div>
                        }
                        <div className={cl.categories__search}>
                            <CustomInput
                                value={categoryTitle}
                                onChange={e => setCategoryTitle(e.target.value)}
                                onKeyDown={handleCategoryKeyDown}
                                className={cl.category__input}
                            />
                            <FaSearch className={cl.searchIcon} onClick={handleCategorySearchSubmit}/>
                        </div>
                        {categories.map(category => (
                            <label key={category.id} className={cl.custom__checkbox}>
                                <input
                                    type="checkbox"
                                    name={category.id}
                                    checked={productStore.filters.category_id === category.id}
                                    onChange={(event) => handleCheckboxChange(event, category.id)}
                                />
                                <span className={cl.checkmark}></span>
                                {category.title}
                            </label>
                        ))}
                    </div>
                )}
            </div>
            <div className={cl.categories}>
                {categories
                    .filter(category => productStore.filters.category_id === category.id)
                    .map(category => (
                        <label key={category.id} className={cl.custom__checkbox}>
                            <input
                                type="checkbox"
                                name={category.id}
                                checked={productStore.filters.category_id === category.id}
                                onChange={(event) => handleCheckboxChange(event, category.id)}
                            />
                            <span className={cl.checkmark}></span>
                            {category.title}
                        </label>
                    ))}
            </div>
        </div>
    );
});

export default CategorySelect;
