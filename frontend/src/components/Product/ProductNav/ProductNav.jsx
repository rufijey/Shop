import React from 'react';
import cl from './ProductNav.module.css';
import {useNavigate, useLocation} from "react-router-dom";

const ProductNav = ({slug, link}) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Функция для проверки, активна ли ссылка
    const isActive = (path) => location.pathname === path;

    return (
        <div className={cl.product__nav}>
            <div
                onClick={() => navigate(`/${link}/${slug}`)}
                className={[cl.link, isActive(`/${link}/${slug}`) ? cl.underline : ''].join(' ')}
            >
                Product
            </div>
            <div
                onClick={() => navigate(`/${link}/${slug}/about`)}
                className={[cl.link, isActive(`/${link}/${slug}/about`) ? cl.underline : ''].join(' ')}
            >
                About
            </div>
            <div
                onClick={() => navigate(`/${link}/${slug}/reviews`)}
                className={[cl.link, isActive(`/${link}/${slug}/reviews`) ? cl.underline : ''].join(' ')}
            >
                Reviews
            </div>
        </div>
    );
};

export default ProductNav;
