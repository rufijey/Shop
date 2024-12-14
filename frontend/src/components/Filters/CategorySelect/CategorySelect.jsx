import React, {useRef, useState} from "react";
import { CSSTransition } from "react-transition-group";
import cl from "../Filters.module.css";
import productStore from "../../../store/ProductStore";
import { observer } from "mobx-react-lite";
import CustomInput from "../../UI/input/CustomInput";
import CustomButton from "../../UI/button/CustomButton";
import Loader from "../../UI/loader/Loader";
import FilterStore from "../../../store/FilterFetchingStore";

const CategorySelect = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const [categoryTitle, setCategoryTitle] = useState("");
    const ref = useRef();

    const toggleList = () => {
        setIsOpen((prev) => !prev);
    };

    const handleCategoryKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleCategorySearchSubmit()
        }
    }

    const handleCategorySearchSubmit = async () => {
        await FilterStore.fetchCategories(categoryTitle);
    };

    return (
        <div className={cl.container}>
            <div className={cl.select}>
                <CustomButton onClick={toggleList} className={cl.valuesOpen}>
                    Category
                </CustomButton>
                <CSSTransition
                    in={isOpen}
                    timeout={300}
                    nodeRef={ref}
                    classNames={{
                        enter: cl.enter,
                        enterActive: cl.enterActive,
                        exit: cl.exit,
                        exitActive: cl.exitActive,
                    }}
                    unmountOnExit
                >
                    <div ref={ref} className={cl.values}>
                        <div className={cl.values__search}>
                            <CustomInput
                                value={categoryTitle}
                                onChange={(e) => setCategoryTitle(e.target.value)}
                                className={cl.value__input}
                                onKeyDown={handleCategoryKeyDown}
                            />
                        </div>
                        {FilterStore.categoriesLoading && (
                            <div className={cl.above_loader}>
                                <Loader />
                            </div>
                        )}
                        {FilterStore.categories.map((category) => (
                            <label key={category.id} className={cl.custom__checkbox}>
                                <input
                                    type="checkbox"
                                    name={category.id}
                                    checked={productStore.filters.category_id === category.id}
                                    onChange={(event) =>
                                        productStore.setFilter(
                                            "category_id",
                                            event.target.checked ? category.id : null
                                        )
                                    }
                                />
                                <span className={cl.checkmark}></span>
                                {category.title}
                            </label>
                        ))}
                    </div>
                </CSSTransition>
            </div>
        </div>
    );
});

export default CategorySelect;
