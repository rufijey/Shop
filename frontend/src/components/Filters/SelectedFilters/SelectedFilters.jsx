import React, {useEffect, useState} from 'react';
import productStore from "../../../store/ProductStore";
import cl from './SelectedFilters.module.css';
import FilterService from "../../../services/FilterService";
import {observer} from "mobx-react-lite";
import CustomButton from "../../UI/button/CustomButton";
import {IoCloseSharp} from "react-icons/io5";
import Loader from "../../UI/loader/Loader";
import filterStore from "../../../store/FilterFetchingStore";

const SelectedFilters = observer(() => {
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false)

    const applyFilters = async () => {
        productStore.syncUrl()
        await productStore.fetchProducts()
    }

    const clearFilters = async () => {
        productStore.resetFilters()
        await productStore.fetchProducts()
    }

    const fetchFilters = async () => {
        try {
            setLoading(true)
            const res = await FilterService.getSelected(productStore.filters);
            setFilters(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchFilters();
    }, [productStore.filters.category_id, productStore.filters.characteristic_ids]);

    const handleCategoryRemove = () => {
        productStore.removeCategory()
    }

    const handleCharacteristicRemove = (characteristic) => {
        productStore.removeCharacteristic(characteristic)
    }

    // if (loading && !productStore.loading) {
    //     return <div className={cl.loader__container}><Loader classNames={cl.loader}/></div>;
    // }

    return (
        <div className={cl.filters}>
            <div className={cl.button} onClick={applyFilters}>apply</div>
            <div className={cl.button} onClick={clearFilters}>clear</div>
            {filters && filters.category && (
                <div className={cl.button}>
                    {filters.category.title}
                    <IoCloseSharp className={cl.close} onClick={handleCategoryRemove}/>
                </div>
            )}

            {filters && filters.characteristics && filters.characteristics.length > 0 && (
                filters.characteristics.map((char) => (
                    <div key={char.id} className={cl.button}>
                        {char.body}
                        <IoCloseSharp className={cl.close} onClick={() => {
                            handleCharacteristicRemove(char)
                        }}/>
                    </div>
                ))
            )}
        </div>
    );
});

export default SelectedFilters;
