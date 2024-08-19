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
                path: "/user/register",
                element: <Register/>,
            },
            {
                path: "/user/login",
                element: <Login/>,
            },
            {
                path: "/user/me",
                element: <UserPage/>,
            },
            {
                path: "/products/:slug",
                element: <ProductPage/>,
            },
            {
                path: "*",
                element: <Error404/>,
            }
        ],
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
