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
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await AuthStore.login(loginForm)
    };

    return (
        <div className={cl.container}>
            <form className={cl.form__container} onSubmit={handleSubmit}>
                <CustomInput placeholder="email"
                             value={loginForm.email}
                             onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                             type="email"
                />
                <CustomInput placeholder="password"
                             value={loginForm.password}
                             onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                             type="password"
                />
                <CustomButton type="submit">Login</CustomButton>
            </form>
        </div>
    );
});

export default Login;
