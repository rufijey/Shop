import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';
import authStore from "../../../store/AuthStore";
import CustomButton from "../../../components/UI/button/CustomButton";
import CustomInput from "../../../components/UI/input/CustomInput";
import cl from './Login.module.css'
import {getFingerprint} from "../../../services/FingerprintService";
import {jwtDecode} from "jwt-decode";
import api from "../../../api";
import axios from "axios";
import UserService from "../../../services/UserService";
import AuthStore from "../../../store/AuthStore";

const Login = observer(() => {
    const [loginForm, setLoginForm] = useState({
        email:'',
        password:'',
        fingerprint: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await AuthStore.login(loginForm)
        }catch (err){
            console.log(err)
            setError(err.response.data)
        }
    };

    return (
        <div className={cl.container}>
            <form className={cl.form__container} onSubmit={handleSubmit}>
                <CustomInput placeholder="email"
                             value={loginForm.email}
                             onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                             type="email"
                />
                {error && error.errors && <div className={cl.error}>{error.errors.email[0]}</div>}
                <CustomInput placeholder="password"
                             value={loginForm.password}
                             onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                             type="password"
                />
                {error && error.error && <div className={cl.error}>Wrong password</div>}
                <div className={cl.forgot}
                     onClick={()=> navigate('/user/password/forgot', {state: {email: loginForm.email}})}
                >Forgot your password?</div>
                <CustomButton type="submit" className={cl.button}>Login</CustomButton>
            </form>
        </div>
    );
});

export default Login;
