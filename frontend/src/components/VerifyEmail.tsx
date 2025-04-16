import React, { useState } from 'react';
import { isProd } from '../utils';

const app_name = "cop4331.tech";

function buildPath(route: string) : string {
    if (isProd()) {
        return 'http://' + app_name + route;
    } else {
        return 'http://localhost:5001' + route;
    }
}

function VerifyEmail()
{
    const [verifyEmail, setVerifyEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSetVerifyEmail = (event:React.ChangeEvent<HTMLInputElement>) =>
    {
        setVerifyEmail(event.target.value);
    }

    const validateEmail = () =>
    {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(verifyEmail)) return 'Invalid email';
        return '';
    }

    const sendVerification = async (event:React.FormEvent) =>
    {
        event.preventDefault();
        const checkEmail = validateEmail();
        if(checkEmail)  //invalid email check
        {
            setMessage(checkEmail);
            return;
        }

        const obj = { email: verifyEmail };
        const js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath('/api/register'),
            { 
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });
            const res = await response.json(); // Parse response

            setMessage(res.message);
        }
        catch(error: any)
        {
            setMessage('Error occurred');
            console.error('Signup error:', error);
        }
    }


    return(
        <div id="verifyBox" className="accountBox">
            <h1 className="p-6 font-bold">Signup</h1>
            <p>Please enter your email.</p>
            <p className="pb-4">A verification email will be sent to it.</p>
            <form id="verifyInput" onSubmit={sendVerification}>
                <input
                    className="accountInput"
                    type="text"
                    id="theEmail"
                    placeholder="Email"
                    value={verifyEmail}
                    onChange={handleSetVerifyEmail}
                />
                <div id="verifyResultDiv">
                    <span id="verifyResult">{message}</span> {/* Feedback */}
                </div>
                <input
                    className="bg-[#598392] text-white font-bold px-4 py-3 rounded-[10px] my-3 hover:bg-[#90b0bb]"
                    type="submit"
                    id="submitButton"
                />
            </form>
            <p>Already have an account? Login <a href="/login">here</a>!</p>
        </div>
    );
}
export default VerifyEmail;