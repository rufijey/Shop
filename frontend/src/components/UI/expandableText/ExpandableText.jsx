import React, { useState } from 'react';
import cl from './ExpandableText.module.css';
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";

const ExpandableText = ({ text, maxLength = 100, className }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const getTrimmedText = (text, maxLength) => {
        let trimmedText = text.slice(0, maxLength).trim();
        trimmedText = trimmedText.replace(/[.,;:!?]$/, '');
        return trimmedText;
    };

    const displayedText = isExpanded
        ? text
        : getTrimmedText(text, maxLength) + (text.length > maxLength ? '...' : '');

    return (
        <div className={cl.container}>
            <span className={className}>
                {displayedText}
            </span>
            {text.length > maxLength && (
                <div onClick={toggleExpanded} className={cl.button}>
                    {isExpanded ? <FaArrowUp /> : <FaArrowDown />}
                </div>
            )}
        </div>
    );
};

export default ExpandableText;
