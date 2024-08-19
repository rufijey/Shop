import React from 'react';
import authStore from "../store/AuthStore";
import {Navigate, Outlet} from "react-router-dom";

const UnRegisteredRoute = ({children}) => {
    if(authStore.isAuthenticated){
        return <Navigate to={'/user/me'}/>
    }
    return <Outlet/>;
};

export default UnRegisteredRoute;