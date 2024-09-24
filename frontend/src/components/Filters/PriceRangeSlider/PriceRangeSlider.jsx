import React, {useState, useEffect} from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import cl from './PriceRangeSlider.module.css';
import ProductService from "../../../services/ProductService";
import productStore from "../../../store/ProductStore";
import {observer} from "mobx-react-lite";

const PriceRangeSlider = observer(({loading, maxPrice}) => {
    const handleSliderChange = (value) => {
        productStore.setFilter('price_range',{ min: value[0], max: value[1] });
    };


    const handleInputChange = (index, value) => {
        const newRange = {
            max: productStore.filters.price_range.max,
            min: productStore.filters.price_range.min
        }
        newRange[index] = Number(value);
        productStore.setFilter('price_range',newRange);
    };

    return (
        <div className={cl.slider__container}>
            <h3>Price Range</h3>
            {!loading &&
                <div>
                    <Slider
                        range
                        min={0}
                        max={maxPrice}
                        value={[
                            productStore.filters.price_range.min || 0,
                            productStore.filters.price_range.max || maxPrice
                        ]}
                        onChange={handleSliderChange}
                        trackStyle={[{backgroundColor: 'green'}]}
                        handleStyle={[
                            {borderColor: 'green', backgroundColor: 'white'},
                            {borderColor: 'green', backgroundColor: 'white'},
                        ]}
                        railStyle={{backgroundColor: '#f3f3f3'}}
                    />
                    <div className={cl.price__display}>
                        <input
                            type="number"
                            value={productStore.filters.price_range.min || 0}
                            onChange={(e) => handleInputChange('min', e.target.value)}
                            min={0}
                            max={productStore.filters.price_range.max}
                            className={cl.input}
                        />
                        <input
                            type="number"
                            value={productStore.filters.price_range.max || maxPrice}
                            onChange={(e) => handleInputChange('max', e.target.value)}
                            min={productStore.filters.price_range.min}
                            max={productStore.filters.price_range.max}
                            className={cl.input}
                        />
                    </div>
                </div>
            }
        </div>
    );
});

export default PriceRangeSlider;
