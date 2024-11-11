import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import Loader from "../../../components/UI/loader/Loader";
import cl from './VerifyEmail.module.css'
import AccountService from "../../../services/AccountService";
import authStore from "../../../store/AuthStore";

const VerifyEmail = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const verify = async()=>{
        console.log(queryParams.get('id'))
        console.log(queryParams.get('hash'))
        try {
            await authStore.verify(queryParams.get('id'), queryParams.get('hash'))
        }catch (err){
            console.log(err)
        }
    }

    useEffect(() => {
        verify()
    }, []);
    return (
        <div>
            <div className={cl.loader}>
                <Loader/>
            </div>
        </div>
    );
};

export default VerifyEmail;