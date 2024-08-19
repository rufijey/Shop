import React, {useEffect, useMemo, useState} from 'react';
import cl from './ImageGallery.module.css';

const ImageGallery = ({images}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const visibleThumbnails = 5;
    const [leftThumbnailsNav, setLeftThumbnailsNav] = useState([cl.thumb__nav, cl.left].join(' '))
    const [rightThumbnailsNav, setRightThumbnailsNav] = useState([cl.thumb__nav, cl.right].join(' '))
    useEffect(() => {
        if (startIndex !== 0) {
            setLeftThumbnailsNav([cl.thumb__nav, cl.left].join(' '))
        } else {
            setLeftThumbnailsNav([cl.thumb__nav, cl.left, cl.hidden].join(' '))
        }

        if (startIndex + visibleThumbnails < images.length) {
            setRightThumbnailsNav([cl.thumb__nav, cl.right].join(' '))
        } else {
            setRightThumbnailsNav([cl.thumb__nav, cl.right, cl.hidden].join(' '))
        }
    }, [startIndex]);
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
        if (startIndex + visibleThumbnails < images.length) {
            setStartIndex(startIndex + 1);
        }
    };

    const prevThumbnails = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    return (<div className={cl.gallery}>
        <div className={cl.container}>
            <div className={cl.main__image__container}>
                {images.length !== 1 &&
                    <button className={[cl.nav, cl.left].join(' ')} onClick={prevImage}>
                        ❮
                    </button>
                }
                <img
                    id="main-image"
                    src={images[currentImageIndex].url}
                    alt="Main"
                />
                {images.length !== 1 &&
                    <button className={[cl.nav, cl.right].join(' ')} onClick={nextImage}>
                        ❯
                    </button>
                }
            </div>
            <div className={cl.thumbnails__container}>
                <button className={leftThumbnailsNav} onClick={prevThumbnails}>
                    ❮
                </button>
                <div className={cl.thumbnails}>
                    {images.slice(startIndex, startIndex + visibleThumbnails).map((image, index) => (<img
                        key={index + startIndex}
                        src={image.url}
                        alt={`Thumbnail ${index + 1 + startIndex}`}
                        onClick={() => changeImage(index + startIndex)}
                        className={(index + startIndex) === currentImageIndex ? cl.active : ""}
                    />))}
                </div>
                <button className={rightThumbnailsNav} onClick={nextThumbnails}>
                    ❯
                </button>

            </div>
        </div>
    </div>);
};

export default ImageGallery;
