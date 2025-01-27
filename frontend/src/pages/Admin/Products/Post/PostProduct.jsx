import React, { useState, useCallback, useEffect } from 'react';
import cl from './PostProduct.module.css';

import PostProductForm from "../../../../components/Product/PostForm/PostProductForm";

const PostProduct = () => {
    return (
        <div>
            <PostProductForm/>
        </div>
    );
};

export default PostProduct;
