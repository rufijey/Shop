import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import Loader from "../../../../components/UI/loader/Loader";
import cl from './VerifyEmail.module.css'
import EmailService from "../../../../services/EmailService";
import authStore from "../../../../store/AuthStore";

const VerifyEmail = () => {
    const params = useParams()
    const verify = async()=>{
        try {
            await authStore.verify(params.id, params.hash)
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