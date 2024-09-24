import React, {useState} from 'react';
import cl from "./UpdateReviewForm.module.css";
import StarRatings from "react-star-ratings/build/star-ratings";
import ReviewService from "../../../services/ReviewService";

const PostReviewForm = ({product, review, setModal, fetchProduct}) => {
    const [content, setContent] = useState(review.content);
    const [rating, setRating] = useState(review.rating);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            content: content,
            rating: rating,
            product_id: product.id
        }
        const res = await ReviewService.update(review.id, data)
        setModal(false)
        await fetchProduct()
    };
    const handleDelete = async (e) => {
        e.preventDefault();

        const res = await ReviewService.delete(review.id)
        setModal(false)
        await fetchProduct()
    };

    return (
        <div className={cl.container}>
            {error && <p style={{color: 'red'}}>{error}</p>}
            Rate product
            <div>
                <StarRatings
                    rating={rating}
                    starRatedColor="gold"
                    changeRating={setRating}
                    numberOfStars={5}
                    name='rating'
                    starDimension="20px"
                    starSpacing="0"
                    starHoverColor="yellow"
                />
                <textarea
                    value={content}
                    className={cl.textarea}
                    placeholder="description"
                    onChange={e => setContent(e.target.value)}
                />
                <div className={cl.buttons}>
                    <div className={cl.button__container}>
                        <div onClick={handleSubmit} className={cl.submit}>
                            Submit
                        </div>
                    </div>
                    <div className={cl.button__container}>
                        <div onClick={handleDelete} className={cl.delete}>
                            Delete
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PostReviewForm;
