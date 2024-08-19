import React from 'react';
import authStore from "../store/AuthStore";
import {Navigate, Outlet} from "react-router-dom";

const RegisteredRoute = ({children}) => {
    if(!authStore.isAuthenticated){
        return <Navigate to={'/user/login'}/>
    }
    return <Outlet/>;
};

export default RegisteredRoute;