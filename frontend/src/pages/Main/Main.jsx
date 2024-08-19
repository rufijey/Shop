import React, {useEffect, useState} from 'react';
import cl from './Main.module.css'
import CategoryService from "../../services/CategoryService";
import TagService from "../../services/TagService";
const Main = () => {
    const [categories, setCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)
    const [tags, setTags] = useState([])
    const [tagsLoading, setTagsLoading] = useState(false)
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
        fetchCategories();
        fetchTags();
    }, []);
    return (
        <div className={cl.container}>
            <div className={cl.title}>SHOP</div>
            <div className={cl.links}>
                <div className={cl.item__container}>
                    <div className={cl.item__title}>Categories</div>
                    <div className={cl.list}>
                        {categories.map(category=>
                            <div key={category.id} className={cl.link}>
                                {category.title}
                            </div>
                        )}
                    </div>
                </div>
                <div className={cl.item__container}>
                    <div className={cl.item__title}>Tags</div>
                    <div className={cl.list}>
                        {tags.map(tag=>
                            <div key={tag.id} className={cl.link}>
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