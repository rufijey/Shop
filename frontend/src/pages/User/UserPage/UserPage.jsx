import React, { useEffect, useState } from 'react';
import authStore from "../../../store/AuthStore";
import cl from './UserPage.module.css';
import UserService from "../../../services/UserService";
import Loader from "../../../components/UI/loader/Loader";

const UserPage = () => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const res = await UserService.get();
            console.log(res.data);
            setUser(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className={cl.loader}>
                <Loader />
            </div>
        );
    }

    return (
        <div className={cl.container}>
            {user ? (
                <div className={cl.profileCard}>
                    <div className={cl.userInfo}>
                        <h1 className={cl.userName}>{user.name}</h1>
                        <p className={cl.userRole}>{user.role}</p>
                        <div className={cl.userDetails}>
                            <p><strong>Email:</strong> {user.email}</p>
                        </div>
                    </div>

                    <div className={cl.sectionContainer}>
                        <div className={cl.section}>
                            <h2 className={cl.sectionTitle}>Orders</h2>
                            {user.orders && user.orders.length > 0 ? (
                                user.orders.map(order => (
                                    <div key={order.id} className={cl.orderCard}>
                                        <p><strong>Date:</strong> {formatDate(order.date)}</p>
                                        <p><strong>Completeness:</strong> {order.completeness || "In progress"}</p>

                                        {order.products && order.products.length > 0 && (
                                            <div className={cl.productsList}>
                                                {order.products.map(product => (
                                                    <div key={product.id} className={cl.productCard}>
                                                        <img
                                                            src={product.images[0]?.url}
                                                            alt={product.title}
                                                            className={cl.productImage}
                                                        />
                                                        <div className={cl.productDetails}>
                                                            <p><strong>Title:</strong> {product.title}</p>
                                                            <p><strong>Price:</strong> {product.price}</p>
                                                            <p><strong>Quantity:</strong> {product.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No orders available</p>
                            )}
                        </div>

                        <div className={cl.section}>
                            <h2 className={cl.sectionTitle}>Reviews</h2>
                            {user.reviews && user.reviews.length > 0 ? (
                                user.reviews.map(review => (
                                    <div key={review.id} className={cl.reviewCard}>
                                        <div>
                                            <p><strong>Product:</strong> {review.product.title}</p>
                                            <p><strong>Rating:</strong> {review.rating}</p>
                                            <p><strong>Content:</strong> {review.content}</p>
                                            <p><strong>Date:</strong> {formatDate(review.date)}</p>
                                        </div>
                                        {review.product.images && review.product.images.length > 0 && (
                                            <img
                                                src={review.product.images[0].url}
                                                alt={review.product.title}
                                                className={cl.reviewProductImage}
                                            />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No reviews available</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p className={cl.noData}>User data not available</p>
            )}
        </div>
    );
};

export default UserPage;
