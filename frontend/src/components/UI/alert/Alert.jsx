import React, { useEffect, useState } from 'react';
import cl from './Alert.module.css';

const Alert = ({ message, onClose, duration = 3000 , className}) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const showTimeout = setTimeout(() => {
            setVisible(true);
        }, 100);

        const hideTimeout = setTimeout(() => {
            setVisible(false);
        }, duration + 100);

        return () => {
            clearTimeout(showTimeout);
            clearTimeout(hideTimeout);
        };
    }, [duration]);


    useEffect(() => {
        if (!visible) {
            const timeoutId = setTimeout(onClose, 500); // 500ms соответствует времени перехода в CSS
            return () => clearTimeout(timeoutId);
        }
    }, [visible, onClose]);

    return (
        <div className={`${cl.alertContainer} ${visible ? cl.show : cl.hide}`}>
            <div className={[cl.alertBox, className].join(' ')}>
                <span className={cl.message}>{message}</span>
                <button className={cl.closeButton} onClick={() => setVisible(false)}>
                    &times;
                </button>
            </div>
        </div>
    );
};

export default Alert;
