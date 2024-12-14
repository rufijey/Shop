import React, {useEffect, useRef, useState} from "react";
import { CSSTransition } from "react-transition-group";
import cl from "../Filters.module.css";
import Loader from "../../UI/loader/Loader";
import productStore from "../../../store/ProductStore";
import { observer } from "mobx-react-lite";
import CustomInput from "../../UI/input/CustomInput";
import CustomButton from "../../UI/button/CustomButton";
import FilterStore from "../../../store/FilterFetchingStore";

const CharacteristicCheckboxSelect = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const [characteristicTitle, setCharacteristicTitle] = useState("");
    const ref = useRef();

    const toggleList = () => {
        setIsOpen((prev) => !prev);
    };

    const handleCheckboxChange = (event, characteristicId) => {
        if (event.target.checked) {
            productStore.setFilter("characteristic_ids", [...productStore.filters.characteristic_ids, characteristicId]);
        } else {
            productStore.setFilter(
                "characteristic_ids",
                productStore.filters.characteristic_ids.filter((id) => id !== characteristicId)
            );
        }
    };

    const handleCharacteristicsKeyDown = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            await handleCharacteristicsSearchSubmit();
        }
    };

    const handleCharacteristicsSearchSubmit = async () => {
        await FilterStore.fetchGroupedCharacteristics(characteristicTitle);
    };

    return (
        <div className={cl.container}>
            <div className={cl.select}>
                <CustomButton onClick={toggleList} className={cl.valuesOpen}>
                    Characteristics
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
                                value={characteristicTitle}
                                onChange={(e) => setCharacteristicTitle(e.target.value)}
                                onKeyDown={handleCharacteristicsKeyDown}
                                className={cl.value__input}
                            />
                        </div>
                        {FilterStore.groupedCharacteristicsLoading && (
                            <div className={cl.above_loader}>
                                <Loader />
                            </div>
                        )}
                        {FilterStore.groupedCharacteristics.map((group) => (
                            <div key={group.type} className={cl.group}>
                                <div className={cl.group__title}>{group.type}</div>
                                {group.characteristics.map((characteristic) => (
                                    <label key={characteristic.id} className={cl.custom__checkbox}>
                                        <input
                                            type="checkbox"
                                            name={characteristic.id}
                                            checked={productStore.filters.characteristic_ids.includes(characteristic.id)}
                                            onChange={(event) => handleCheckboxChange(event, characteristic.id)}
                                        />
                                        <span className={cl.checkmark}></span>
                                        <div className={cl.body}>{characteristic.body}</div>
                                    </label>
                                ))}
                            </div>
                        ))}
                    </div>
                </CSSTransition>
            </div>
        </div>
    );
});

export default CharacteristicCheckboxSelect;
