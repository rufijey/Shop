import React, { useEffect, useRef, useState } from 'react';
import cl from './CustomSelect.module.css';

const CustomSelect = ({ options, defaultValue, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const selectedOption = options.find(option => option.id === value);

    const handleOptionClick = (optionId) => {
        onChange(optionId);
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
            setIsOpen(false);
            document.removeEventListener('mousedown', handleClickOutside);
        }
    };
    const handleOpen = () => {
        setIsOpen(!isOpen)
        document.addEventListener('mousedown', handleClickOutside);
    };

    useEffect(() => {

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={selectRef} className={cl.customSelectContainer}>
            <div className={cl.selectedValue} onClick={handleOpen}>
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
