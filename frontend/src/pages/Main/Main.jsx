import React, {useEffect, useState} from 'react';
import cl from './Main.module.css'
import CategoryService from "../../services/CategoryService";
import TagService from "../../services/TagService";
import productStore from "../../store/ProductStore";
import {useNavigate} from "react-router-dom";
import Loader from "../../components/UI/loader/Loader";
const Main = () => {
    const [categories, setCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)
    const [tags, setTags] = useState([])
    const [tagsLoading, setTagsLoading] = useState(false)
    const navigate = useNavigate()
    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const res = await CategoryService.getAll();
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setCategoriesLoading(false);
        }
    };
    const fetchTags = async () => {
        try {
            setTagsLoading(true);
            const res = await TagService.getAll();
            setTags(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setTagsLoading(false);
        }
    };

    useEffect(() => {
        productStore.resetFilters()
        fetchCategories();
        fetchTags();
    }, []);

    const handleCategoryClick = (category) => {
        productStore.setFilter('category_id', category.id)
        navigate('/products')
    }

    const handleTagClick = (tag) => {
        productStore.setFilter('tag_ids', [tag.id])
        navigate('/products')
    }

    return (
        <div className={cl.container}>
            <div className={cl.links}>
                <div className={cl.item__container}>
                    <div className={cl.item__title}>Categories</div>
                    {categoriesLoading ? <Loader/> :
                        <div className={cl.list}>
                            {categories.map(category =>
                                <div key={category.id} className={cl.link}
                                     onClick={() => handleCategoryClick(category)}>
                                    {category.title}
                                </div>
                            )}
                        </div>
                    }
                </div>
                <div className={cl.item__container}>
                    <div className={cl.item__title}>Tags</div>
                    {tagsLoading ? <Loader/> :
                        <div className={cl.list}>
                            {tags.map(tag =>
                                <div key={tag.id} className={cl.link} onClick={() => handleTagClick(tag)}>
                                    {tag.title}
                                </div>
                            )}
                        </div>
                    }

                </div>
            </div>
        </div>
    );
};

export default Main;