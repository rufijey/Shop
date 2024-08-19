import React, { useState } from 'react';
import cl from './CustomSelect.module.css';

const CustomSelect = ({ options, defaultValue, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Найти объект с выбранным id
    const selectedOption = options.find(option => option.id === value);

    const handleOptionClick = (optionId) => {
        onChange(optionId);
        setIsOpen(false);
    };

    return (
        <div className={cl.customSelectContainer}>
            <div className={cl.selectedValue} onClick={() => setIsOpen(!isOpen)}>
                {selectedOption ? selectedOption.title : defaultValue}
            </div>
            {isOpen && (
                <ul className={cl.optionsList}>
                    {options.map(option => (
                        <li
                            key={option.id}
                            className={cl.optionItem}
                            onClick={() => handleOptionClick(option.id)}
                        >
                            {option.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
