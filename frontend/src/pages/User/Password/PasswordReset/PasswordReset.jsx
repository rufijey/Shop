import React, {useState} from 'react';
import cl from './PasswordReset.module.css'
import CustomInput from "../../../../components/UI/input/CustomInput";
import CustomButton from "../../../../components/UI/button/CustomButton";
import {useNavigate} from "react-router-dom";
import AuthStore from "../../../../store/AuthStore";
import AccountService from "../../../../services/AccountService";
import authStore from "../../../../store/AuthStore";

const PasswordReset = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const [form, setForm] = useState({
        email: queryParams.get('email'),
        password:'',
        password_confirmation: '',
        token: queryParams.get('token')
    });

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await AccountService.resetPassword(form)
            if (authStore.isAuthenticated){
                await authStore.logout()
            }
            console.log(123)
            navigate('/user/login')
        }catch (err){
            console.log(err)
        }
    };

    return (
        <div className={cl.container}>
            <form className={cl.form__container} onSubmit={handleSubmit}>
                <CustomInput placeholder="password"
                             value={form.password}
                             onChange={e => setForm({...form, password: e.target.value})}
                             type="password"
                />
                <CustomInput placeholder="password confirmation"
                             value={form.password_confirmation}
                             onChange={e => setForm({
                                 ...form,
                                 password_confirmation: e.target.value
                             })}
                             type="password"
                />
                <CustomButton type="submit">Reset password</CustomButton>
            </form>
        </div>
    );
};

export default PasswordReset;