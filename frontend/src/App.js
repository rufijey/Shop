import {RouterProvider} from "react-router-dom";
import "./styles/App.css"
import router from "./router";
import authStore from "./store/AuthStore";
import Cookies from 'js-cookie';
import { v4 } from 'uuid';
import React from "react";
import orderStore from "./store/OrderStore";

function App() {
    // React.useEffect(()=>{
    //     if(!authStore.isAuthenticated && !Cookies.get('guest_id')){
    //         const uniqueId = v4();
    //         Cookies.set('guest_id', uniqueId, { expires: 3650, path: '/' });
    //         console.log(Cookies.get('guest_id'))
    //     }
        // else if(authStore.isAuthenticated && Cookies.get('guest_id')){
        //     Cookies.remove('guest_id', { path: '/' });
        // }
    // }, [])

    return (
        <RouterProvider router={router} />
    );
}

export default App;
