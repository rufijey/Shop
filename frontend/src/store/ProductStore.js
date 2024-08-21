import {action, makeAutoObservable} from 'mobx';
import router from "../router";
import ProductService from "../services/ProductService";
import {getPagesCount} from "../utils/pages";

class ProductStore {
    filters = {
        title: '',
        category_id: null,
        tag_ids: [],
        price_range: { min: 0, max: null },
        page: 1,
        per_page: 1
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

        this.filters.title = searchParams.get('title') || '';
        this.filters.category_id = searchParams.get('category_id') ? parseInt(searchParams.get('category_id')) : null;

        this.filters.tag_ids = searchParams.get('tag_ids')
            ? searchParams.get('tag_ids').split(',').map(id => parseInt(id))
            : [];

        this.filters.price_range = {
            min: searchParams.get('min_price') ? parseInt(searchParams.get('min_price')) : 0,
            max: searchParams.get('max_price') ? parseInt(searchParams.get('max_price')) : null,
        };
        this.filters.page = parseInt(searchParams.get('page')) || 1;
        this.filters.per_page = parseInt(searchParams.get('per_page')) || 10;
    }


    syncUrl() {
        const searchParams = new URLSearchParams();

        if (this.filters.title) searchParams.set('title', this.filters.title);
        if (this.filters.category_id) searchParams.set('category_id', this.filters.category_id);
        if (this.filters.tag_ids.length) searchParams.set('tag_ids', this.filters.tag_ids.join(','));
        if (this.filters.price_range.min) searchParams.set('min_price', this.filters.price_range.min);
        if (this.filters.price_range.max) searchParams.set('max_price', this.filters.price_range.max);
        searchParams.set('page', this.filters.page);
        searchParams.set('per_page', this.filters.per_page);
        router.navigate({ search: searchParams.toString() });
    }

    resetFilters() {
        this.filters = {
            title: '',
            category_id: null,
            tag_ids: [],
            price_range: { min: 0, max: null },
            page: 1,
            per_page: 10
        };
        this.syncUrl()
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

    setPage = (page) => {
        this.filters.page = page;
        this.syncUrl();
        this.fetchProducts()
    };

    clearProducts = () =>{
        this.products = []
    }

    setProducts(products) {
        this.products = products;
    }

    setLoading(loading) {
        this.loading = loading;
    }

    setTotalPages(totalPages) {
        this.totalPages = totalPages;
    }

}

const productStore = new ProductStore();
export default productStore;
