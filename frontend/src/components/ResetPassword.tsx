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

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSetEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleSetCode = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, ''); // Only digits
        if (value.length <= 6) {
            setCode(value);
        }
    };

    const handleSetPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSetPasswordConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirm(event.target.value);
    };

    const checkInput = () => {
        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email required';
        if (!emailPattern.test(email)) return 'Invalid email';

        // Code validation
        if (!code) return 'Reset code required';
        if (!/^\d{6}$/.test(code)) return 'Code must be exactly 6 digits';

        // Password validation
        if (!password) return 'Password required';
        if (!passwordConfirm) return 'Please confirm your password';

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordPattern.test(password)) {
            return 'Password needs 8+ chars, upper, lower, number, special';
        }
        if (password !== passwordConfirm) return 'Passwords do not match';

        return '';
    };

    const resetPassword = async (event: React.FormEvent) => {
        event.preventDefault();
        const checkInputResult = checkInput();
        if (checkInputResult) {
            setMessage(checkInputResult);
            return;
        }

        setIsLoading(true);
        const obj = { email, code, password };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('/api/reset-password'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            const res = await response.json();

            if (res.error) {
                setMessage(res.error);
            } else {
                setMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        } catch (error: any) {
            setMessage('Failed to reset password. Please try again.');
            console.error('Reset password error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="resetPasswordBox" className="accountBox">
            <h1 className="p-6 font-bold">Reset Password</h1>
            <p>Enter your email, the 6-digit code sent to you, and your new password.</p>
            <form id="resetPasswordInput" onSubmit={resetPassword}>
                <div id="emailDiv" className="text-left py-1">
                    <label htmlFor="resetEmail">Email</label>
                    <input
                        className="accountInput"
                        type="email"
                        id="resetEmail"
                        placeholder="Email"
                        value={email}
                        onChange={handleSetEmail}
                        disabled={isLoading}
                    />
                </div>
                <div id="codeDiv" className="text-left py-1">
                    <label htmlFor="resetCode">Reset Code</label>
                    <input
                        className="accountInput"
                        type="text"
                        id="resetCode"
                        placeholder="6-digit code"
                        value={code}
                        onChange={handleSetCode}
                        disabled={isLoading}
                        maxLength={6}
                    />
                </div>
                <div id="passwordDiv" className="text-left py-1">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        className="accountInput"
                        type="password"
                        id="newPassword"
                        placeholder="New Password"
                        value={password}
                        onChange={handleSetPassword}
                        disabled={isLoading}
                    />
                </div>
                <div id="passwordConfirmDiv" className="text-left py-1">
                    <label htmlFor="passwordConfirm">Confirm Password</label>
                    <input
                        className="accountInput"
                        type="password"
                        id="passwordConfirm"
                        placeholder="Confirm Password"
                        value={passwordConfirm}
                        onChange={handleSetPasswordConfirm}
                        disabled={isLoading}
                    />
                </div>
                <div id="resetPasswordResultDiv">
                    <span id="resetPasswordResult">{message}</span>
                </div>
                <input
                    className="bg-[#598392] text-white font-bold px-4 py-3 rounded-[10px] my-3 hover:bg-[#90b0bb]"
                    type="submit"
                    id="submitButton"
                    value={isLoading ? 'Resetting...' : 'Reset Password'}
                    disabled={isLoading}
                />
            </form>
            <p>
                Need a new code? Request one <a href="/forgot-password">here</a>!
            </p>
            <p>
                Return to login <a href="/login">here</a>!
            </p>
        </div>
    );
}

export default ResetPassword;
