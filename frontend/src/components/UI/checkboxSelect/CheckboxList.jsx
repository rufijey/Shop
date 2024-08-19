import React, {useState} from 'react';


const CheckboxList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});

    const toggleList = () => {
        setIsOpen(!isOpen);
    };

    const handleCheckboxChange = (event) => {
        setCheckedItems({
            ...checkedItems,
            [event.target.name]: event.target.checked,
        });
    };

    const items = ['Item 1', 'Item 2', 'Item 3'];

    return (
        <div className="sidebar">
            <div onClick={toggleList}>
                {isOpen ? 'Hide List' : 'Show List'}
            </div>

            {isOpen && (
                <div>
                    {items.map((item, index) => (
                        <div key={index}>
                            <input
                                type="checkbox"
                                name={item}
                                checked={checkedItems[item] || false}
                                onChange={handleCheckboxChange}
                            />
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CheckboxList;
