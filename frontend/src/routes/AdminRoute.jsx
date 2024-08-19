import React from 'react';
import authStore from "../store/AuthStore";
import {Navigate} from "react-router-dom";

const AdminRoute = ({children}) => {
    if(!authStore.isAuthenticated){
        return <Navigate to={'/user/login'}/>
    }
    if(!authStore.isAdmin){
        return <Navigate to={'/user/me'}/>
    }
    return children;
};

export default AdminRoute;