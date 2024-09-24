import React, {useEffect, useState} from 'react';
import CategorySelect from "./CategorySelect/CategorySelect";
import TagCheckboxSelect from "./TagSelect/TagCheckboxSelect";
import PriceRangeSlider from "./PriceRangeSlider/PriceRangeSlider";
import cl from './Filters.module.css'
import productStore from "../../store/ProductStore";
import CategoryService from "../../services/CategoryService";
import Loader from "../UI/loader/Loader";
import TagService from "../../services/TagService";
import ProductService from "../../services/ProductService";
const Filters = () => {
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagsLoading, setTagsLoading] = useState(true);
    const [priceLoading, setPriceLoading] = useState(true);
    const [maxPrice, setMaxPrice] = useState(1000);

    const applyFilters = async () => {
        productStore.syncUrl()
        await productStore.fetchProducts()
    }

    const clearFilters = async () => {
        productStore.resetFilters()
        await productStore.fetchProducts()
    }

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
    const fetchTags = async (title) => {
        try {
            setTagsLoading(true);
            const res = await TagService.getAll(title);
            setTags(res.data);
        } catch (error) {
            console.error("Error fetching tags:", error);
        } finally {
            setTagsLoading(false);
        }
    };

    const fetchMaxPrice = async () => {
        try {
            setPriceLoading(true)
            const response = await ProductService.maxPrice();
            const price = Number(response.data.max_price)
            setMaxPrice(price);
            if(!productStore.filters.price_range.max){
                productStore.setFilter('price_range',{min: 0, max: price});
            }
        } catch (error) {
            console.error("Error fetching max price:", error);
        } finally {
            setPriceLoading(false)
        }
    };


    useEffect(() => {
        fetchCategories()
        fetchTags()
        fetchMaxPrice()
    }, []);


    if(categoriesLoading && tagsLoading && priceLoading){
        return (
            <div className={cl.loader}>
                <Loader/>
            </div>
        )
    }

    return (
        <div className={cl.items}>
            <div className={cl.categories}>
                <CategorySelect loading={categoriesLoading} categories={categories} fetchCategories={fetchCategories}/>
            </div>
            <div className={cl.tags}>
                <TagCheckboxSelect loading={tagsLoading} fetchTags={fetchTags} tags={tags}/>
            </div>
            <div className={cl.slider}>
                <PriceRangeSlider loading={priceLoading} maxPrice={maxPrice}/>
            </div>
            <div className={cl.filter__btns}>
                <div className={cl.filter__btn} onClick={applyFilters}>Apply</div>
                <div className={cl.filter__btn} onClick={clearFilters}>Clear</div>
            </div>
        </div>
    );
};

export default Filters;