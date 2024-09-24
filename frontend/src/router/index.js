import React from 'react';
import {createBrowserRouter} from "react-router-dom";
import Main from "../pages/Main/Main";
import UserLayout from "../layouts/UserLayout/UserLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AdminMain from "../pages/Admin/Main/AdminMain";
import AdminCategories from "../pages/Admin/Categories/AdminCategories";
import AdminTags from "../pages/Admin/Tags/AdminTags";
import AdminProducts from "../pages/Admin/Products/Main/AdminProducts";
import PostProduct from "../pages/Admin/Products/Post/PostProduct";
import AdminProductPage from "../pages/Admin/Products/ProductPage/AdminProductPage";
import UpdateProduct from "../pages/Admin/Products/Update/UpdateProduct";
import Register from "../pages/User/Register/Register";
import Login from "../pages/User/Login/Login";
import UserPage from "../pages/User/UserPage/UserPage";
import AdminRoute from "../routes/AdminRoute";
import Error404 from "../pages/Error/Error404";
import Products from "../pages/Products/Main/Products";
import ProductPage from "../pages/Products/ProductPage/ProductPage";
import ProductsLayout from "../layouts/ProductsLayout/ProductsLayout";
import UnRegisteredRoute from "../routes/UnRegisteredRoute";
import RegisteredRoute from "../routes/RegisteredRoute";
import ProductPageLayout from "../layouts/ProductPageLayout/ProductPageLayout";
import ProductAbout from "../pages/Products/About/ProductAbout";
import Reviews from "../pages/Products/Reviews/Reviews";
import VerifyEmail from "../pages/User/Email/Verify/VerifyEmail";

const router = createBrowserRouter([
    {
        path: "/",
        element: <UserLayout/>,
        children: [
            {
                path: "/",
                element: <Main/>,
            },
            {
                element: <UnRegisteredRoute/>,
                children:[
                    {
                        path: "/user/register",
                        element: <Register/>,
                    },
                    {
                        path: "/user/login",
                        element: <Login/>,
                    },
                    {
                        path: "/email/verify/:id/:hash",
                        element: <VerifyEmail/>,
                    },
                ]
            },
            {
                element: <RegisteredRoute/>,
                children:[
                    {
                        path: "/user/me",
                        element: <UserPage/>,
                    },
                ]
            },
            {
                path: "*",
                element: <Error404/>,
            }
        ],
    },
    {
        path: "/products/:slug",
        element: <ProductPageLayout/>,
        children: [
            {
                path: "/products/:slug",
                element: <ProductPage/>,
            },
            {
                path: "/products/:slug/about",
                element: <ProductAbout/>,
            },
            {
                path: "/products/:slug/reviews",
                element: <Reviews/>,
            }
        ]
    },
    {
        path: "/products",
        element: <ProductsLayout/>,
        children: [
            {
                path: "/products",
                element: <Products/>,
            }
        ]
    },
    {
        path: "/admin",
        element: (
            <AdminRoute>
                <AdminLayout/>
            </AdminRoute>),
        children: [
            {
                path: "/admin",
                element: <AdminMain/>,
            },
            {
                path: "/admin/categories",
                element: <AdminCategories/>,
            },
            {
                path: "/admin/tags",
                element: <AdminTags/>,
            },
            {
                path: "/admin/products",
                element: <AdminProducts/>,
            },
            {
                path: "/admin/products/:slug",
                element: <AdminProductPage/>,
            },
            {
                path: "/admin/products/:slug/update",
                element: <UpdateProduct/>,
            },
            {
                path: "/admin/products/post",
                element: <PostProduct/>
            },
        ],
    },
]);

export default router;
