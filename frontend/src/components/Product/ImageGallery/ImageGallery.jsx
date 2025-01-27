import React, {useEffect, useRef, useState} from 'react';
import {Scrollbars} from 'react-custom-scrollbars-2';
import cl from './ImageGallery.module.css';
import {smoothScroll} from "../../../utils/smoothScroll";

const ImageGallery = ({images}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const thumbnailsRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(images.length >= 5);

    const renderView = (props) => {
        return <div className={cl.customView} {...props} />;
    };
    const changeImage = (index) => {
        setCurrentImageIndex(index);
    };

    const nextImage = () => {
        setCurrentImageIndex((currentImageIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);
    };

    const nextThumbnails = () => {
        if (thumbnailsRef.current) {
            smoothScroll(258, thumbnailsRef);
        }
    };

    const prevThumbnails = () => {
        if (thumbnailsRef.current) {
            smoothScroll(-258, thumbnailsRef);
        }
    };
    // const nextThumbnails = () => {
    //     if (thumbnailsRef.current) {
    //         thumbnailsRef.current.view.scrollTo({
    //             left: thumbnailsRef.current.getScrollLeft() + 94,
    //             behavior: 'smooth'
    //         });
    //     }
    // };
    //
    // const prevThumbnails = () => {
    //     if (thumbnailsRef.current) {
    //         thumbnailsRef.current.view.scrollTo({
    //             left: thumbnailsRef.current.getScrollLeft() - 94,
    //             behavior: 'smooth'
    //         });
    //     }
    // };
    const handleScrollFrame = ({scrollLeft, scrollWidth, clientWidth}) => {
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < (scrollWidth - clientWidth));
    };

    return (
        <div className={cl.gallery}>
            <div className={cl.container}>
                <div className={cl.main__container}>
                    {images.length !== 1 &&
                        <button className={[cl.nav, cl.left].join(' ')} onClick={prevImage}>
                            ❮
                        </button>
                    }
                    <div className={cl.main__image__container}>
                        <img
                            src={images[currentImageIndex].url}
                            alt="Main"
                        />
                    </div>
                    {images.length !== 1 &&
                        <button className={[cl.nav, cl.right].join(' ')} onClick={nextImage}>
                            ❯
                        </button>
                    }
                </div>

                <div className={cl.thumbnails__container}>
                    <button className=
                                {canScrollLeft ? cl.thumb__nav : [cl.thumb__nav, cl.hidden].join(' ')}
                            onClick={prevThumbnails}>
                        ❮
                    </button>
                    <Scrollbars
                        autoHide
                        autoHideTimeout={1000}
                        autoHideDuration={200}
                        ref={thumbnailsRef}
                        className={cl.thumbnails}
                        renderView={renderView}
                        onScrollFrame={handleScrollFrame}
                    >
                        {images.map((image, index) => (
                            <div className={cl.thumbnails__image__container}
                                 key={image.url}
                            >
                                <img
                                    src={image.url}
                                    alt={`Thumbnail ${index + 1}`}
                                    onClick={() => changeImage(index)}
                                    className={(index) === currentImageIndex ? cl.active : ""}
                                />
                            </div>

                        ))}
                    </Scrollbars>
                    <button className={
                        canScrollRight ? cl.thumb__nav : [cl.thumb__nav, cl.hidden].join(' ')}
                            onClick={nextThumbnails}>
                        ❯
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ImageGallery;
