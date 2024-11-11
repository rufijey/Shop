import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cl from './PasswordForgot.module.css';
import AccountService from "../../../../services/AccountService"; // Предполагаем, что у вас есть сервис для отправки писем

const ResendRegisterEmail = () => {
    const [email, setEmail] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(0);
    const [message, setMessage] = useState(''); // Для отображения сообщения
    const delay = 30; // Задержка в секундах
    const navigate = useNavigate();

    useEffect(() => {
        let countdown;
        if (timer > 0) {
            countdown = setTimeout(() => setTimer(timer - 1), 1000);
        }
        return () => clearTimeout(countdown);
    }, [timer]);

    const handleSendEmail = async () => {
        try {
            if (timer === 0 && !isResending) {
                setIsResending(true);

                const res = await AccountService.forgotPassword(email);
                setMessage('A password reset link has been sent to your email.');
                setIsResending(false);
                setTimer(delay);
            }
        } catch (err) {
            setIsResending(false);
        }
    };

    return (
        <div className={cl.container}>
            <h2>Password Reset</h2>
            <div className={cl.info}>
                <p>Please enter your email to receive a password reset link.</p>
            </div>
            <div className={cl.form}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cl.input}
                />
                <button
                    className={cl.button}
                    onClick={handleSendEmail}
                    disabled={timer > 0 || isResending}
                >
                    {isResending ? 'Sending...' : 'Send Email'}
                </button>
                {timer > 0 && (
                    <p>Please wait {timer} seconds before trying again.</p>
                )}
                {/* Сообщение об отправке письма */}
                {message && (
                    <p className={cl.message}>{message}</p>
                )}
            </div>
            <div>
                <button
                    className={cl.back__button}
                    onClick={() => navigate('/user/login')}
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default ResendRegisterEmail;
