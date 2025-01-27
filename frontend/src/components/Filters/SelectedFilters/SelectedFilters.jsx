import React, {useEffect, useState, useRef, createRef} from 'react';
import productStore from "../../../store/ProductStore";
import cl from './SelectedFilters.module.css';
import FilterService from "../../../services/FilterService";
import {observer} from "mobx-react-lite";
import {IoCloseSharp} from "react-icons/io5";
import {TransitionGroup, CSSTransition} from 'react-transition-group';

const SelectedFilters = observer(() => {
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const buttonRef = useRef(null)

    const applyFilters = async () => {
        productStore.syncUrl();
        await productStore.fetchProducts();
    };

    const clearFilters = async () => {
        productStore.resetFilters();
        await productStore.fetchProducts();
    };

    const fetchFilters = async () => {
        try {
            setLoading(true);
            const res = await FilterService.getSelected(productStore.filters);
            const category = res.data.category ? {...res.data.category, ref: createRef()} : res.data.category
            const characteristics = res.data.characteristics ? res.data.characteristics.map((char) => ({
                ...char,
                ref: createRef()
            })) : res.data.characteristics
            const filters = {category: category, characteristics: characteristics}
            setFilters(filters);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilters();
    }, [productStore.filters.category_id, productStore.filters.characteristic_ids]);

    const handleCategoryRemove = () => {
        productStore.removeCategory();
    };

    const handleCharacteristicRemove = (characteristic) => {
        productStore.removeCharacteristic(characteristic);
    };

    return (
        <div className={cl.filters}>
            <TransitionGroup className={cl.filters}>
                <CSSTransition
                    nodeRef={buttonRef}
                    timeout={0}
                >
                    <div className={cl.buttons_container}>
                        <div className={cl.button} onClick={applyFilters}>apply</div>
                        <div className={cl.button} onClick={clearFilters}>clear</div>
                    </div>
                </CSSTransition>
                {filters && filters.category && (
                    <CSSTransition
                        nodeRef={filters.category.ref}
                        key="category"
                        timeout={300}
                        classNames={{
                            enter: cl.enter,
                            enterActive: cl.enterActive,
                            exit: cl.exit,
                            exitActive: cl.exitActive,
                        }}
                    >
                        <div ref={filters.category.ref} className={cl.button}>
                            {filters.category.title}
                            <IoCloseSharp className={cl.close} onClick={handleCategoryRemove}/>
                        </div>
                    </CSSTransition>
                )}

                {filters && filters.characteristics && filters.characteristics.length > 0 && (
                    filters.characteristics.map((char) => (
                        <CSSTransition
                            nodeRef={char.ref}
                            key={char.id}
                            timeout={300}
                            classNames={{
                                enter: cl.enter,
                                enterActive: cl.enterActive,
                                exit: cl.exit,
                                exitActive: cl.exitActive,
                            }}
                        >
                            <div ref={char.ref} className={cl.button}>
                                {char.body}
                                <IoCloseSharp
                                    className={cl.close}
                                    onClick={() => handleCharacteristicRemove(char)}
                                />
                            </div>
                        </CSSTransition>
                    ))
                )}
            </TransitionGroup>

        </div>
    );
});

export default SelectedFilters;

