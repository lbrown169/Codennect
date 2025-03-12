import React, { useState } from 'react';
function Signup()
{
    const [message,setMessage] = useState('');
    const [signupFullName,setSignupFullName] = React.useState('');
    const [signupEmail,setSignupEmail] = React.useState('');
    const [signupPassword,setSignupPassword] = React.useState('');
    const [passwordConfirm,setPasswordConfirm] = React.useState('');

    function handleSetSignupFullName( e: any ) : void
    {
        setSignupFullName(e.target.value);
    }
    function handleSetSignupEmail( e: any ) : void
    {
        setSignupEmail(e.target.value);
    }
    function handleSetSignupPassword( e: any) : void
    {
        setSignupPassword(e.target.value);
    }
    function handleSetPasswordConfirm( e: any ) : void
    {
        setPasswordConfirm(e.target.value);
    }

    //checks for valid input in fields
    function checkInput()
    {
        //missing input check
        if(signupFullName.length === 0)
        {
            return 'Please enter your name';
        }
        if(signupEmail.length === 0)
        {
            return 'Please enter an email';
        }
        if(signupPassword.length === 0)
        {
            return 'Please enter a password';
        }

        //validate password
        if(signupPassword.length < 8)
        {
            return 'Password should be at least 8 characters long';
        }
        if(signupPassword !== passwordConfirm)
        {
            return 'Passwords do not match';
        }

        //valid email check
        //no spaces anywhere
        //no start with @
        //contains an @ somewhere
        //@ must be before a .
        //at least one non-@ character between @ and .
        //at least one non-@ character after final .
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var validEmail = pattern.test(signupEmail);
        if(!(validEmail))
        {
            return 'Invalid email';
        }
        
        return '';
    }

    async function doSignup(event:any) : Promise<void>
    {
        alert("Not yet implemented");
        event.preventDefault();
        var checkInputResult = checkInput();
        if(checkInputResult.length !== 0)
        {
            setMessage(checkInputResult);
            return;
        }
        
        var obj={name:signupFullName,email:signupEmail,password:signupPassword};
        var js = JSON.stringify(obj);

        setMessage('Currently valid input');
    }

    return (
        <div id="signupDiv">
        <h1>Signup</h1>

        <form id="signupInput">
            <div id="fullNameDiv">
                <div id="fullNameLabel">
                    <label>Full Name</label>
                </div>
                <input type="text" id="signupFullName" placeholder="Full Name" onChange={handleSetSignupFullName}></input>
            </div>
            <div id="emailDiv">
                <div id="emailLabel">
                    <label>Email</label>
                </div>
                <input type="email" id="signupEmail" placeholder="Email" onChange={handleSetSignupEmail}></input> 
            </div>
            <div id="passwordDiv">
                <div id="passwordLabel">
                    <label>Password</label>
                </div>
                <input type="password" id="signupPassword" placeholder="Password" onChange={handleSetSignupPassword}></input>
            </div>
            <div id="passwordConfirmDiv">
                <div id="passwordConfirmLabel">
                    <label>Re-enter password</label>
                </div>
                <input type="password" id="passwordConfirm" placeholder="Confirm Password" onChange={handleSetPasswordConfirm}></input>
            </div>

            <div id="signupResultDiv">
                <span id="signupResult">{message}</span>
            </div>
      
            <input type="submit" id="submitButton" value="Create Account" onClick={doSignup}></input>
        </form>
        <p>Already have an account? Login <a href="/login">here</a>!</p>

        </div>
    );

};
export default Signup;