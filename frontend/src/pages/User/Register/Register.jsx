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
import Loader from "../../../components/UI/loader/Loader";

const Register = observer(() => {
    const [registrationForm, setRegistrationForm] = useState({
        name:'',
        email:'',
        password:'',
        password_confirmation: '',
        fingerprint: ''
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        try {
            setLoading(true)
            e.preventDefault();
            await AuthStore.register(registrationForm)
            navigate('/user/register/resend', {state: {email: registrationForm.email}})
            setLoading(false)
        }catch (err){
            setLoading(false)
            console.log(err.response.data.errors)
            setError(err.response.data.errors)
        }
    };

    return (
        <div className={cl.container}>
            {/*{loading &&*/}
            {/*    <div className={cl.loader}><Loader/></div>*/}
            {/*}*/}
            <form className={cl.form__container} onSubmit={handleSubmit}>
                <CustomInput placeholder="name"
                             value={registrationForm.name}
                             onChange={e => setRegistrationForm({...registrationForm, name: e.target.value})}
                             type="text"
                />
                {error && error.name && <div className={cl.error}>{error.name[0]}</div>}
                <CustomInput placeholder="email"
                             value={registrationForm.email}
                             onChange={e => setRegistrationForm({...registrationForm, email: e.target.value})}
                             type="email"
                />
                {error && error.email && <div className={cl.error}>{error.email[0]}</div>}
                <CustomInput placeholder="password"
                             value={registrationForm.password}
                             onChange={e => setRegistrationForm({...registrationForm, password: e.target.value})}
                             type="password"
                />
                {error && error.password && <div className={cl.error}>{error.password[0]}</div>}
                <CustomInput placeholder="password confirmation"
                             value={registrationForm.password_confirmation}
                             onChange={e => setRegistrationForm({
                                 ...registrationForm,
                                 password_confirmation: e.target.value
                             })}
                             type="password"
                />
                {error && error.password_confirmation && <div className={cl.error}>{error.password_confirmation[0]}</div>}
                <CustomButton type="submit" className={cl.button}>Register</CustomButton>
            </form>
        </div>
    );
});

export default Register;
