import {action, makeAutoObservable} from 'mobx';
import router from "../router";
import ProductService from "../services/ProductService";
import {getPagesCount} from "../utils/pages";
import {createRef} from "react";

class ProductStore {
    filters = {
        search: '',
        category_id: null,
        tag_ids: [],
        price_range: { min: 0, max: null },
        page: 1,
        per_page: 1,
        sort_by:{
            field: 'created_at',
            direction: 'asc',
        }
    };
    loading = true;
    products = [];
    totalPages = 0;

    constructor() {
        makeAutoObservable(this);
        this.initializeFilters();
    }

    initializeFilters() {
        const searchParams = new URLSearchParams(window.location.search);

        this.filters.search = searchParams.get('search') || '';
        this.filters.category_id = searchParams.get('category_id') ? parseInt(searchParams.get('category_id')) : null;

        this.filters.tag_ids = searchParams.get('tag_ids')
            ? searchParams.get('tag_ids').split(',').map(id => parseInt(id))
            : [];

        this.filters.price_range = {
            min: searchParams.get('min_price') ? parseInt(searchParams.get('min_price')) : 0,
            max: searchParams.get('max_price') ? parseInt(searchParams.get('max_price')) : null,
        };
        this.filters.sort_by = {
            field: searchParams.get('sort_field') || 'created_at',
            direction: searchParams.get('sort_direction') || 'asc',
        };
        this.filters.page = parseInt(searchParams.get('page')) || 1;
        this.filters.per_page = parseInt(searchParams.get('per_page')) || 10;
    }


    syncUrl() {
        const searchParams = this.getSearchParams()
        router.navigate({ search: searchParams.toString() });
    }
    syncReplaceUrl() {
        const searchParams = this.getSearchParams()
        router.navigate({ search: searchParams.toString() }, {replace: true});
    }
    // searchProducts (){
    //     const searchParams = this.getSearchParams()
    //     router.navigate( `/products?${searchParams.toString()}`);
    // }

    getSearchParams(){
        const searchParams = new URLSearchParams();
        if (this.filters.search) searchParams.set('search', this.filters.search);
        if (this.filters.category_id) searchParams.set('category_id', this.filters.category_id);
        if (this.filters.tag_ids.length) searchParams.set('tag_ids', this.filters.tag_ids.join(','));
        if (this.filters.price_range.min) searchParams.set('min_price', this.filters.price_range.min);
        if (this.filters.price_range.max) searchParams.set('max_price', this.filters.price_range.max);
        if (this.filters.sort_by.field) searchParams.set('sort_field', this.filters.sort_by.field);
        if (this.filters.sort_by.direction) searchParams.set('sort_direction', this.filters.sort_by.direction);
        searchParams.set('page', this.filters.page);
        searchParams.set('per_page', this.filters.per_page);
        return searchParams
    }

    resetFilters() {
        this.filters = {
            search: '',
            category_id: null,
            tag_ids: [],
            price_range: { min: 0, max: null },
            page: 1,
            per_page: 10,
            sort_by:{
                field: 'created_at',
                direction: 'asc',
            }
        };
        if(window.location.pathname !== '/'){
            this.syncUrl()
        }
    }

    fetchProducts = async () => {
        try {
            this.setLoading(true)
            const res = await ProductService.getAll(this.filters)
            this.setProducts(res.data)
            const totalCount = res.headers['x-total-count']
            this.setTotalPages(getPagesCount(totalCount, this.filters.per_page))
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            this.setLoading(false)
        }
    }

    setFilter(key, value) {
        this.filters[key] = value;
    }

    setSortBy = async (field, direction) => {
        if (field && direction){
            this.filters.sort_by = { field, direction };
            this.syncUrl();
            await this.fetchProducts();
        }
    };


    setPage = (page) => {
        this.filters.page = page;
        this.syncUrl();
        this.fetchProducts()
    };

    clearProducts = () =>{
        this.products = []
    }

    setProducts(products) {
        this.products = products.map(product => ({
            ...product,
            nodeRef: createRef()
        }));
    }
    setLoading(loading) {
        this.loading = loading;
    }

    setTotalPages(totalPages) {
        this.totalPages = totalPages;
    }
    get sort() {
        // if (!this.filters.sort_by) {
        //     return 'created_at|asc';
        // }
        return `${this.filters.sort_by.field}|${this.filters.sort_by.direction}`
    }

}

const productStore = new ProductStore();
export default productStore;
