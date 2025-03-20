import React from 'react';
import {useDropzone} from 'react-dropzone';
import {RxCross2} from "react-icons/rx";
import {NumericFormat} from "react-number-format";
import CustomInput from "../../UI/input/CustomInput";
import CustomSelect from "../../UI/select/CustomSelect";
import CharacteristicSelector from "../../Characteristic/Selector/CharacteristicSelector";
import CustomButton from "../../UI/button/CustomButton";
import cl from './ProductForm.module.css';

const ProductForm = ({product, setProduct, categories, characteristics, loading, onDrop, handleRemoveImage, handleSubmit}) => {
    const {getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone({onDrop});

    return (
        <div className={cl.form}>
            <div {...getRootProps({
                className: `${cl.dropzone} ${isDragActive ? cl.active : ''} ${isDragReject ? cl.reject : ''}`
            })}>
                <input {...getInputProps()} />
                <p className={cl.text}>Drag images or click to choose</p>
                <div className={cl.preview__container}>
                    {product.images.map((image, index) => (
                        <div key={index} className={cl.preview}>
                            <img src={image.url} alt="Preview" className={cl.preview__image}/>
                            <RxCross2 className={cl.delete} onClick={(e) => handleRemoveImage(image, e)}/>
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
                className={cl.num}
            />
            <CustomSelect
                options={categories}
                defaultValue={product.category.title}
                value={product.category.id}
                onChange={value => setProduct({...product, category: {id: value}})}
            />
            <CharacteristicSelector
                characteristics={characteristics}
                loading={loading}
                selectedCharacteristics={product.characteristics}
                setSelectedCharacteristics={(characteristics) => setProduct({...product, characteristics})}
            />
            <div>
                <CustomButton onClick={handleSubmit}>Submit</CustomButton>
            </div>
        </div>
    );
};

export default ProductForm;
