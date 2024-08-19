import React, {useState, useCallback, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import cl from './UpdateProduct.module.css';
import axios from "axios";
import CustomInput from "../../../../components/UI/input/CustomInput";
import {NumericFormat} from "react-number-format";
import CustomSelect from "../../../../components/UI/select/CustomSelect";
import CategoryService from "../../../../services/CategoryService";
import TagService from "../../../../services/TagService";
import TagSelector from "../../../../components/Tag/Selector/TagSelector";
import ProductService from "../../../../services/ProductService";
import {RxCross2} from "react-icons/rx";
import {useNavigate, useParams} from "react-router-dom";

const UpdateProduct = () => {
    const [deleteClick, setDeleteClick] = useState(false);
    const [categories, setCategories] = useState([])
    const [product, setProduct] = useState({
        title: '',
        description: '',
        price: '',
        quantity: '',
        category: {
            id: 'default',
            title: 'choose category'
        },
        tags: [],
        images: [],
        image_ids_for_delete: []
    });
    const navigate = useNavigate();
    const params = useParams()

    const onDrop = useCallback((acceptedImages) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            images: [
                ...(prevProduct.images || []),
                ...acceptedImages.map(image => ({
                    image: image,
                    url: URL.createObjectURL(image)
                }))
            ]
        }));
    }, []);

    const dropzoneClasses = [cl.dropzone];
    if (!deleteClick) {
        dropzoneClasses.push(cl.drz);
    }

    useEffect(() => {
        fetchCategories()
        fetchProduct()
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await CategoryService.getAll();
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
    const fetchProduct = async () => {
        try {
            const res = await ProductService.get(params.slug);
            setProduct(res.data)
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    const handleRemoveImage = (image, e) => {
        e.stopPropagation();
        if (image.id) {
            setProduct(prevProduct => ({
                ...prevProduct,
                images: prevProduct.images.filter(i => i !== image),
                image_ids_for_delete: [...product.image_ids_for_delete || [], image.id]
            }));
        } else {
            setProduct((prevProduct) => ({
                ...prevProduct,
                images: prevProduct.images.filter(i => i.url !== image.url)
            }));
        }
    };

    const handleSubmit = async () => {

        const formData = new FormData();
        product.images.forEach(image => {
            if (image.image) {
                formData.append('images[]', image.image);
            }
        });
        formData.append('title', product.title);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('quantity', product.quantity);
        formData.append('category_id', product.category.id);
        product.tags.forEach(tag => {
            formData.append('tag_ids[]', tag.id);
        });
        product.image_ids_for_delete.forEach(image_id => {
            formData.append('image_ids_for_delete[]', image_id);
        });
        formData.append('_method', 'PATCH');

        try {
            const res = await ProductService.update(formData, params.slug);
            navigate('/admin/products')
        } catch (error) {
            if (error.response) {
                console.error('Validation errors:', error.response.data.errors);
            } else {
                console.error('Failed to upload images:', error.message);
            }
        }

    };

    const {getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone({onDrop});

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
                            <div key={`${image.url}-${index}`} className={cl.preview}>
                                <img src={image.url} alt="Preview" className={cl.preview__image}/>
                                <RxCross2 className={cl.delete}
                                          onClick={(e) => handleRemoveImage(image, e)}
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
                    onChange={e => setProduct({...product, title: e.target.value})}
                />
                <textarea
                    value={product.description}
                    className={cl.textarea}
                    placeholder="description"
                    onChange={e => setProduct({...product, description: e.target.value})}
                />
                <NumericFormat
                    value={product.price}
                    placeholder="price"
                    min="0"
                    step="0.01"
                    className={cl.num}
                    onValueChange={(values) => setProduct({...product, price: values.floatValue || ''})}
                    prefix="₴"
                    thousandSeparator
                    customInput={CustomInput}
                />
                <CustomInput
                    value={product.quantity}
                    type="number"
                    placeholder="quantity"
                    onChange={e => setProduct({...product, quantity: e.target.value})}
                    min="0"
                    className={cl.num}
                />
                <CustomSelect
                    options={categories}
                    defaultValue={product.category.title}
                    value={product.category.id}
                    onChange={value => setProduct({...product, category: {id: value}})}
                />
                <TagSelector
                    selectedTags={product.tags}
                    setSelectedTags={(tags) => setProduct({...product, tags: tags})}
                />
                <div>
                    <button className={cl.submit__button} onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateProduct;
