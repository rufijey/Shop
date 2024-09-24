import React, {useEffect, useState} from 'react';
import cl from './Reviews.module.css'
import {useNavigate, useOutletContext} from "react-router-dom";
import Loader from "../../../components/UI/loader/Loader";
import ProductService from "../../../services/ProductService";
import ReviewService from "../../../services/ReviewService";
import StarRatings from "react-star-ratings/build/star-ratings";
import Modal from "../../../components/UI/modal/Modal";
import PostReviewForm from "../../../components/Review/PostForm/PostReviewForm";
import authStore from "../../../store/AuthStore";
import UpdateReviewForm from "../../../components/Review/UpdateForm/UpdateReviewForm";

const Reviews = () => {
    const [visibleAdd, setVisibleAdd] = useState(false)
    const [visibleChange, setVisibleChange] = useState(false)
    const {product, loading, fetchProduct} = useOutletContext();

    if (loading) {
        return (
            <div className={cl.loader}>
                <Loader/>
            </div>
        );
    }

    if (!product.slug) {
        return (
            <div>Error</div>
        );
    }
    return (
        <div className={cl.container}>
            <div className={cl.add__review__container}>
                {authStore.isAuthenticated &&
                    <div>
                        {!product.is_reviewed
                            ? <div className={cl.add__review} onClick={() => setVisibleAdd(true)}>
                                add review
                            </div>
                            : <div className={cl.add__review} onClick={() => setVisibleChange(true)}>
                                change review
                            </div>
                        }
                    </div>
                }
            </div>
            {product.reviews.map(review => (
                <div key={review.id} className={cl.review__container}>
                    <div>{review.user.name}</div>

                    <StarRatings
                        rating={review.rating}
                        starRatedColor="#ffd700"
                        numberOfStars={5}
                        name='rating'
                        starDimension="18px"
                        starSpacing="0"
                        isAggregateRating={true}
                    />

                    <div>{review.content}</div>
                </div>
            ))}

            <Modal visible={visibleAdd} setVisible={setVisibleAdd}>
                <PostReviewForm
                    product={product}
                    setModal={setVisibleAdd}
                    fetchProduct={fetchProduct}
                />
            </Modal>

            {product.user_review &&
                <Modal visible={visibleChange} setVisible={setVisibleChange}>
                    <UpdateReviewForm
                        product={product}
                        review={product.user_review}
                        setModal={setVisibleChange}
                        fetchProduct={fetchProduct}
                    />
                </Modal>
            }

        </div>
    );
};

export default Reviews;