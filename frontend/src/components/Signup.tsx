import React, { useEffect, useState } from 'react';
import { isProd } from '../utils';
import { useSearchParams } from 'react-router-dom';

const app_name = "cop4331.tech";

function buildPath(route: string) : string {
    if (isProd()) {
        return 'http://' + app_name + route;
    } else {
        return 'http://localhost:5001' + route;
    }
}


function Signup()
{
    const [searchParams, _] = useSearchParams();
    const [message, setMessage] = useState(''); // Success/error msg
    const [signupFullName, setSignupFullName] = useState(''); // Name state
    const [signupEmail, setSignupEmail] = useState(''); // Email state
    const [signupPassword, setSignupPassword] = useState(''); // Password state
    const [passwordConfirm, setPasswordConfirm] = useState(''); // Confirm state
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleSetSignupFullName = (e: React.ChangeEvent<HTMLInputElement>) => // Update name
    {
        setSignupFullName(e.target.value);
    };

    const handleSetSignupEmail = (e: React.ChangeEvent<HTMLInputElement>) => // Update email
    {
        setSignupEmail(e.target.value);
    };

    const handleSetSignupPassword = (e: React.ChangeEvent<HTMLInputElement>) => // Update password
    {
        setSignupPassword(e.target.value);
    };

    const handleSetPasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => // Update confirm
    {
        setPasswordConfirm(e.target.value);
    };

    const checkInput = () => // Validate inputs
    {
        if (!signupFullName) return 'Name required';
        if (!signupEmail) return 'Email required';
        if (!signupPassword) return 'Password required';

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordPattern.test(signupPassword))
        {
            return 'Password needs 8+ chars, upper, lower, number, special';
        }
        if (signupPassword !== passwordConfirm) return 'Passwords mismatch';

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(signupEmail)) return 'Invalid email';

        return '';
    };

    const doSignup = async (event: React.FormEvent) => // Handle signup
    {
        event.preventDefault();
        const checkInputResult = checkInput();
        if (checkInputResult != '')
        {
            setMessage(checkInputResult);
            return;
        }

        setIsLoading(true); // Disable form
        const obj = { token: searchParams.get("token"), name: signupFullName, email: signupEmail, password: signupPassword };
        const js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath('/api/verify-email'),
            { 
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });
            const res = await response.json();

            if (res.error) {
                // Show error returned from server
                setMessage(res.error);
            } else {
                // Success case: Notify user and redirect to login
                setMessage('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        }
        catch (error: any)
        {
            setMessage('Error occurred');
            console.error('Signup error:', error);
        }
        finally
        {
            setIsLoading(false); // Enable form
        }
    };

    useEffect(() => {
        // Grabs token from URL params (?token=abc123)
        const token = searchParams.get('token');

        if (!token) {
            // If no token is found, redirect user back to registration
            setMessage('No verification token provided. Redirecting...');
            setTimeout(() => {
                window.location.href = '/register';
            }, 2000);
            return;
        }
    }, [searchParams]);

    return (
        <div id="signupDiv" className="accountBox">
            <h1 className="p-6 font-bold">Signup</h1>
            <form id="signupInput" onSubmit={doSignup}> {/* Form wrapper */}
                <div id="fullNameDiv" className="text-left py-1">
                    <div id="fullNameLabel">
                        <label>Full Name</label>
                    </div>
                    <input
                        className="accountInput"
                        type="text"
                        id="signupFullName"
                        placeholder="Full Name"
                        value={signupFullName}
                        onChange={handleSetSignupFullName}
                        disabled={isLoading} // Disable on load
                    />
                </div>
                <div id="emailDiv" className="text-left py-1">
                    <div id="emailLabel">
                        <label>Email</label>
                    </div>
                    <input
                        className="accountInput"
                        type="email"
                        id="signupEmail"
                        placeholder="Email"
                        value={signupEmail}
                        onChange={handleSetSignupEmail}
                        disabled={isLoading}
                    />
                </div>
                <div id="passwordDiv" className="text-left py-1">
                    <div id="passwordLabel">
                        <label>Password</label>
                    </div>
                    <input
                        className="accountInput"
                        type="password"
                        id="signupPassword"
                        placeholder="Password"
                        value={signupPassword}
                        onChange={handleSetSignupPassword}
                        disabled={isLoading}
                    />
                </div>
                <div id="passwordConfirmDiv" className="text-left py-1">
                    <div id="passwordConfirmLabel">
                        <label>Re-enter password</label>
                    </div>
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
                <div id="signupResultDiv">
                    <span id="signupResult">{message}</span> {/* Feedback */}
                </div>
                <input
                    className="bg-[#598392] text-white font-bold px-4 py-3 rounded-[10px] my-3 hover:bg-[#90b0bb]"
                    type="submit"
                    id="submitButton"
                    value={isLoading ? "Creating Account..." : "Create Account"} // Loading text
                    disabled={isLoading}
                />
            </form>
            <p>Already have an account? Login <a href="/login">here</a>!</p>
        </div>
    );
}

export default Signup;
