import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';
import authStore from "../../../store/AuthStore";
import CustomButton from "../../../components/UI/button/CustomButton";
import CustomInput from "../../../components/UI/input/CustomInput";
import cl from './Register.module.css'
import {getFingerprint} from "../../../services/FingerprintService";
import axios from "axios";
import UserService from "../../../services/UserService";
import AuthStore from "../../../store/AuthStore";

const Register = observer(() => {
    const [registrationForm, setRegistrationForm] = useState({
        name:'',
        email:'',
        password:'',
        password_confirmation: '',
        fingerprint: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await AuthStore.register(registrationForm)
    };

    return (
        <div className={cl.container}>
            <form className={cl.form__container} onSubmit={handleSubmit}>
                <CustomInput placeholder="name"
                             value={registrationForm.name}
                             onChange={e => setRegistrationForm({...registrationForm, name: e.target.value})}
                             type="text"
                />
                <CustomInput placeholder="email"
                             value={registrationForm.email}
                             onChange={e => setRegistrationForm({...registrationForm, email: e.target.value})}
                             type="email"
                />
                <CustomInput placeholder="password"
                             value={registrationForm.password}
                             onChange={e => setRegistrationForm({...registrationForm, password: e.target.value})}
                             type="password"
                />
                <CustomInput placeholder="password confirmation"
                             value={registrationForm.password_confirmation}
                             onChange={e => setRegistrationForm({
                                 ...registrationForm,
                                 password_confirmation: e.target.value
                             })}
                             type="password"
                />
                <CustomButton type="submit">Register</CustomButton>
            </form>
        </div>
    );
});

export default Register;
