import React, {useEffect, useState} from 'react';
import cl from './Main.module.css'
import CategoryService from "../../services/CategoryService";
import TagService from "../../services/TagService";
import productStore from "../../store/ProductStore";
import {useNavigate} from "react-router-dom";
import Loader from "../../components/UI/loader/Loader";
import ProductService from "../../services/ProductService";

const Main = () => {
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const fetchCFilters = async () => {
        try {
            setLoading(true);
            const res = await ProductService.getFilters();
            setCategories(res.data.categories);
            setTags(res.data.tags);
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        productStore.resetFilters()
        fetchCFilters();
    }, []);

    const handleCategoryClick = (category) => {
        productStore.setFilter('category_id', category.id)
        navigate('/products')
    }

    const handleTagClick = (tag) => {
        productStore.setFilter('tag_ids', [tag.id])
        navigate('/products')
    }
    if (loading){
        return (
            <div className={cl.loader}>
                <Loader/>
            </div>
        )
    }

    return (
        <div className={cl.container}>
            <div className={cl.links}>
                <div className={cl.item__container}>
                    <div className={cl.item__title}>Categories</div>
                    <div className={cl.list}>
                        {categories.map(category =>
                            <div key={category.id} className={cl.link}
                                 onClick={() => handleCategoryClick(category)}>
                                {category.title}
                            </div>
                        )}
                    </div>
                </div>
                <div className={cl.item__container}>
                    <div className={cl.item__title}>Tags</div>
                    <div className={cl.list}>
                        {tags.map(tag =>
                            <div key={tag.id} className={cl.link} onClick={() => handleTagClick(tag)}>
                                {tag.title}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;