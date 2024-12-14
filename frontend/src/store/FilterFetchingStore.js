import ProductService from "../services/ProductService";
import productStore from "./ProductStore";
import CategoryService from "../services/CategoryService";
import CharacteristicService from "../services/CharacteristicService";
import {makeAutoObservable} from "mobx";
import FilterService from "../services/FilterService";


class FilterFetchingStore {
    categories = [];
    groupedCharacteristics = [];
    maxPrice = 1000;
    groupedCharacteristicsLoading = true;
    categoriesLoading = true;
    priceLoading = true;

    constructor() {
        makeAutoObservable(this);
    }

    setCategoriesLoading(bool){
        this.categoriesLoading = bool;
    }
    setGroupedCharacteristicsLoading(bool){
        this.groupedCharacteristicsLoading = bool;
    }
    setPriceLoading(bool){
        this.priceLoading = bool;
    }
    setCategories(value){
        this.categories = value;
    }
    setGroupedCharacteristics(value){
        this.groupedCharacteristics = value;
    }
    setMaxPrice(value){
        this.maxPrice = value;
    }


    fetchFilters = async () => {
        try {
            this.setCategoriesLoading(true);
            this.setGroupedCharacteristicsLoading(true);
            this.setPriceLoading(true)
            const res = await FilterService.getAll();
            this.setCategories(res.data.categories);
            this.setGroupedCharacteristics(res.data.grouped_characteristics);
            const price = Number(res.data.max_price)
            this.setMaxPrice(price);
            if (!productStore.filters.price_range.max) {
                productStore.setFilter('price_range', {min: 0, max: price});
            }
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            this.setCategoriesLoading(false);
            this.setGroupedCharacteristicsLoading(false);
            this.setPriceLoading(false)
        }
    }

    fetchCategories = async (title) => {
        try {
            this.setCategoriesLoading(true);
            const res = await CategoryService.getAll(title);
            this.setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            this.setCategoriesLoading(false);
        }
    };
    fetchGroupedCharacteristics = async (search) => {
        try {
            this.setGroupedCharacteristicsLoading(true);
            const res = await CharacteristicService.getGrouped(search);
            this.setGroupedCharacteristics(res.data);
        } catch (error) {
            console.error("Error fetching characteristics:", error);
        } finally {
            this.setGroupedCharacteristicsLoading(false);
        }
    };

    get totalLoading() {
       return this.categoriesLoading && this.groupedCharacteristicsLoading && this.priceLoading
    }
}

const filterStore = new FilterFetchingStore();
export default filterStore;
