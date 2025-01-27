import React from 'react';
import cl from './Loader.module.css'

const Loader = ({classNames}) => {
    return (
        <div className={[cl.loader, classNames].join(' ')}>
        </div>
    );
};

export default Loader;