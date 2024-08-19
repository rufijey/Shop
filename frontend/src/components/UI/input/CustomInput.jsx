import React from 'react';
import classes from "./CustomInput.module.css";

const CustomInput = React.forwardRef(({className, ...props}, ref) => {
    return (
        <input ref ={ref} {...props} className={[classes.input, className].join(' ')} />
    );
});

export default CustomInput;