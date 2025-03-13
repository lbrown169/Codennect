import React, { useState } from 'react';

function Login()
{
    const [message, setMessage] = useState(''); // Success/error msg
    const [loginEmail, setLoginEmail] = useState(''); // Email state
    const [loginPassword, setLoginPassword] = useState(''); // Password state
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleSetLoginEmail = (e: React.ChangeEvent<HTMLInputElement>) => // Update email
    {
        setLoginEmail(e.target.value);
    };

    const handleSetLoginPassword = (e: React.ChangeEvent<HTMLInputElement>) => // Update password
    {
        setLoginPassword(e.target.value);
    };

    const validateInput = () => // Validate inputs
    {
        if (!loginEmail) return 'Email required';
        if (!loginPassword) return 'Password required';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(loginEmail)) return 'Invalid email';
        return '';
    };

    const doLogin = async (event: React.FormEvent) => // Handle login
    {
        event.preventDefault();
        const validationError = validateInput();
        if (validationError)
        {
            setMessage(validationError);
            return;
        }

        setIsLoading(true); // Disable form
        const obj = { email: loginEmail, password: loginPassword };
        const js = JSON.stringify(obj);

        try
        {
            const response = await fetch('http://localhost:5001/api/login',
            {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });
            const res = await response.json(); // Parse response

            if (res.id < 0 || res.error?.length > 0)
            {
                setMessage('Login failed');
            }
            else
            {
                const user = { name: res.name, id: res.id };
                localStorage.setItem('user_data', JSON.stringify(user)); // Store user
                setMessage('Success');
                window.location.href = '/dashboard'; // Redirect
            }
        }
        catch (error: any)
        {
            setMessage('Error occurred');
            console.error('Login error:', error);
        }
        finally
        {
            setIsLoading(false); // Enable form
        }
    };

    return (
        <div id="loginDiv">
            <h1>Login</h1>
            <p>Enter login info here.</p>
            <form onSubmit={doLogin}> {/* Form wrapper */}
                <div id="loginEmailDiv">
                    <input
                        type="email"
                        id="loginEmail"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={handleSetLoginEmail}
                        disabled={isLoading} // Disable on load
                    />
                </div>
                <div id="loginPasswordDiv">
                    <input
                        type="password"
                        id="loginPassword"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={handleSetLoginPassword}
                        disabled={isLoading}
                    />
                </div>
                <input
                    type="submit"
                    className="buttons"
                    id="loginButton"
                    value={isLoading ? "Logging in..." : "Login"} // Loading text
                    disabled={isLoading}
                />
                <div id="loginResultDiv">
                    <span id="loginResult">{message}</span> {/* Feedback */}
                </div>
            </form>
            <p>New user? Sign up <a href="/register">here</a>!</p>
        </div>
    );
}

export default Login;
