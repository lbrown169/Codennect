import React, { useState } from 'react';
import { isProd } from '../utils';

const app_name = "cop4331.tech";

function buildPath(route: string): string {
    if (isProd()) {
        return 'http://' + app_name + route;
    } else {
        return 'http://localhost:5001' + route;
    }
}

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSetEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) return 'Invalid email';
        return '';
    };

    const sendResetRequest = async (event: React.FormEvent) => {
        event.preventDefault();
        const checkEmail = validateEmail();
        if (checkEmail) {
            setMessage(checkEmail);
            return;
        }

        setIsLoading(true);
        const obj = { email };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('/api/forgot-password'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            const res = await response.json();

            if (res.error) {
                setMessage(res.error);
            } else {
                setMessage('Reset code sent! Please check your email.');
            }
        } catch (error: any) {
            setMessage('Failed to send reset code. Please try again.');
            console.error('Forgot password error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="forgotPasswordBox" className="accountBox">
            <h1 className="p-6 font-bold">Forgot Password</h1>
            <p>Please enter your email to receive a reset code.</p>
            <form id="forgotPasswordInput" onSubmit={sendResetRequest}>
                <div id="emailDiv" className="text-left py-1">
                    <label htmlFor="forgotEmail">Email</label>
                    <input
                        className="accountInput"
                        type="email"
                        id="forgotEmail"
                        placeholder="Email"
                        value={email}
                        onChange={handleSetEmail}
                        disabled={isLoading}
                    />
                </div>
                <div id="forgotPasswordResultDiv">
                    <span id="forgotPasswordResult">{message}</span>
                </div>
                <input
                    className="bg-[#598392] text-white font-bold px-4 py-3 rounded-[10px] my-3 hover:bg-[#90b0bb]"
                    type="submit"
                    id="submitButton"
                    value={isLoading ? 'Sending...' : 'Send Reset Code'}
                    disabled={isLoading}
                />
            </form>
            <p>
                Remembered your password? Login <a href="/login">here</a>!
            </p>
        </div>
    );
}

export default ForgotPassword;
