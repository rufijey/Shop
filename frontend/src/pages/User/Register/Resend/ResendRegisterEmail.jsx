import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import cl from './ResendRegisterEmail.module.css';
import AccountService from "../../../../services/AccountService";

const ResendRegisterEmail = () => {
    const location = useLocation();
    const {email} = location.state || {};
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(0);
    const delay = 30;

    useEffect(() => {
        let countdown;
        if (timer > 0) {
            countdown = setTimeout(() => setTimer(timer - 1), 1000);
        }
        return () => clearTimeout(countdown);
    }, [timer]);

    const handleResend = async() => {
        if (timer === 0 && !isResending) {
            setIsResending(true);

            const res = await AccountService.resendEmail(email)
            console.log(res)

            setIsResending(false);
            setTimer(delay);
        }
    };

    return (
        <div className={cl.container}>
            <h2>Email Confirmation</h2>
            <div className={cl.info}>
                <p>Please check your email inbox for a confirmation email.</p>
                <p>If you haven't received an email, you can resend it.</p>
                {email && <p>Email: <strong>{email}</strong></p>}
            </div>
            <div>
                <button
                    className={cl.resendButton}
                    onClick={handleResend}
                    disabled={timer > 0 || isResending}
                >
                    {isResending ? 'Resending...' : 'Resend Email'}
                </button>
                {timer > 0 && (
                    <p>Please wait {timer} seconds before trying again.</p>
                )}
            </div>
        </div>
    );
};

export default ResendRegisterEmail;
