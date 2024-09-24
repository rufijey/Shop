import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import cl from './PostProductForm.module.css';
import { NumericFormat } from "react-number-format";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../UI/input/CustomInput";
import CustomSelect from "../../UI/select/CustomSelect";
import TagSelector from "../../Tag/Selector/TagSelector";
import CategoryService from "../../../services/CategoryService";
import ProductService from "../../../services/ProductService";

const PostProductForm = () => {
    const [deleteClick, setDeleteClick] = useState(false);
    const [categories, setCategories]= useState([])
    const [product, setProduct] = useState({
        title: '',
        description: '',
        price: '',
        quantity: '',
        category:{
            id:'default',
            title:'choose category'
        },
        tags: [],
        images: []
    });
    const navigate = useNavigate();

    const onDrop = useCallback((acceptedImages) => {
        setProduct((prevProduct ) => ({
            ...prevProduct,
            images: [
                ...(prevProduct.images || []),
                ...acceptedImages.map(image => ({
                    image: image,
                    url: URL.createObjectURL(image) // Генерация URL для превью
                }))
            ]
        }));
    }, []);

    const dropzoneClasses = [cl.dropzone];
    if (!deleteClick) {
        dropzoneClasses.push(cl.drz);
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await CategoryService.getAll();
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleRemoveFile = (image, e) => {
        e.stopPropagation();
        setProduct((prevProduct) => ({
            ...prevProduct,
            images: prevProduct.images.filter(i => i !== image)
        }));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        product.images.forEach(image => {
            formData.append('images[]', image.image);
        });
        formData.append('title', product.title);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('quantity', product.quantity);
        formData.append('category_id', product.category.id);
        product.tags.forEach(tag => {
            formData.append('tag_ids[]', tag.id);
        });

        try {
            await ProductService.post(formData).then(res => {
            });
            navigate('/admin/products');
        } catch (error) {
            console.error('Failed to upload images:', error);
        }
    };

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({ onDrop });

    return (
        <div className={cl.container}>
            <div className={cl.form}>
                <div {...getRootProps({
                    className: `${dropzoneClasses.join(' ')} ${isDragActive ? cl.active : ''} ${isDragReject ? cl.reject : ''}`
                })}>
                    <input {...getInputProps()} />
                    <p className={cl.text}>Drag images or click to choose</p>
                    <div className={cl.preview__container}>
                        {product.images.map((image, index) => (
                            <div key={index} className={cl.preview}>
                                <img src={image.url} alt="Preview" className={cl.preview__image} />
                                <RxCross2 className={cl.delete}
                                          onClick={(e) => handleRemoveFile(image, e)}
                                          onMouseDown={() => setDeleteClick(true)}
                                          onMouseUp={() => setDeleteClick(false)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <CustomInput
                    value={product.title}
                    type="text"
                    placeholder="title"
                    onChange={e => setProduct({ ...product, title: e.target.value })}
                />
                <textarea
                    value={product.description}
                    className={cl.textarea}
                    placeholder="description"
                    onChange={e => setProduct({ ...product, description: e.target.value })}
                />
                <NumericFormat
                    placeholder="price"
                    min="0"
                    step="0.01"
                    className={cl.num}
                    onValueChange={(values) => setProduct({ ...product, price: values.floatValue || '' })}
                    prefix="₴"
                    thousandSeparator
                    customInput={CustomInput}
                />
                <CustomInput
                    value={product.quantity}
                    type="number"
                    placeholder="quantity"
                    onChange={e => setProduct({ ...product, quantity: e.target.value })}
                    min="0"
                    className={cl.num}
                />
                <CustomSelect
                    options={categories}
                    defaultValue={product.category.title}
                    value={product.category.id}
                    onChange={value => setProduct({ ...product, category: {id:value} })}
                />
                <TagSelector
                    selectedTags={product.tags}
                    setSelectedTags={(tags) => setProduct({ ...product, tags: tags })}
                />
                <div>
                    <button className={cl.submit__button} onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default PostProductForm;
