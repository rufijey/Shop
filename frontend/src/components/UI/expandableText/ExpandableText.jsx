import React, { useState } from 'react';
import cl from './ExpandableText.module.css'
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";

const ExpandableText = ({ text, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const displayedText = isExpanded ? text : text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');

    return (
        <div className={cl.container}>
            {displayedText}
            {text.length > maxLength && !isExpanded && '... '}
            {text.length > maxLength && (
                <div onClick={toggleExpanded} className={cl.button}>
                    {isExpanded ? <FaArrowUp/> : <FaArrowDown/>}
                </div>
            )}
        </div>
    );
};

export default ExpandableText;
