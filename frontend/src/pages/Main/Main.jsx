import React, {useState} from 'react';
import cl from './Main.module.css';
import Loader from "../../components/UI/loader/Loader";
import {Scrollbars} from "react-custom-scrollbars-2";
import productStore from "../../store/ProductStore";

const Main = () => {
    const [loadedImages, setLoadedImages] = useState(0);

    const categoriesData = [
        { id: 1, name: "PCs", image: "/orange_pc.jpg"},
        { id: 2, name: "Video cards", image: "/video_card.jpg"},
        { id: 3, name: "Processors", image: "/processor.jpg"},
        { id: 4, name: "RAM", image: "/ram.jpeg"},
        { id: 5, name: "Cases", image: "/pc_case.jpg"},
        { id: 6, name: "Motherboards", image: "/motherboard.jpg", className: cl.motherboard},
        { id: 7, name: "Keyboards", image: "/keyboard.jpg"},
        { id: 8, name: "Mouses", image: "/mouse.jpg"},
    ];


    const handleImageLoad = () => {
        setLoadedImages((prev) => prev + 1);
    };

    const handleCategoryClick = (id) => {
        productStore.setFilter('category_id', id)
        productStore.searchProducts()
    }

    return (
        <div>
            {loadedImages < 8 &&
                <div className={cl.loader}>
                    <Loader/>
                </div>
            }

            <div className={loadedImages < 8 ? `${cl.container} ${cl.hide}` : `${cl.container}`}>
                <div className={cl.main}>
                    <div className={cl.header}>
                        <h1 className={cl.title}>TechCore</h1>
                    </div>

                    <div className={cl.categories}>
                        {categoriesData.map((category) => (
                            <div
                                key={category.id}
                                className={cl.category}
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                <div className={[cl.image__container, category.className].join(' ')}>
                                    <img onLoad={handleImageLoad} src={category.image} alt={category.name} />
                                </div>
                                <div className={cl.category__about}>{category.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <footer className={cl.footer}>
                    <div className={cl.socials}>
                        <a href="#" className={cl.socialLink}>Facebook</a>
                        <a href="#" className={cl.socialLink}>Instagram</a>
                        <a href="#" className={cl.socialLink}>Twitter</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Main;
