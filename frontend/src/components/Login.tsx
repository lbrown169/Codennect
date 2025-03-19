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
        <div id="loginDiv" className="bg-[#EFF6E0] p-10 rounded-xl text-black text-lg w-lg m-auto">
            <h1 className="p-6 font-bold">Login</h1>
            <p className="pb-4">Enter login info here.</p>
            <form onSubmit={doLogin}> {/* Form wrapper */}
                <div id="loginEmailDiv" className="my-3">
                    <input
                        className="accountInput"
                        type="email"
                        id="loginEmail"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={handleSetLoginEmail}
                        disabled={isLoading} // Disable on load
                    />
                </div>
                <div id="loginPasswordDiv" className="my-3">
                    <input
                        className="accountInput"
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
                    className="bg-[#598392] text-white font-bold px-4 py-3 rounded-[10px] my-3 hover:bg-[#90b0bb]"
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
