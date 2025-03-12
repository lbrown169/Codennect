import React, { useState } from 'react';
function Login()
{
    const [message,setMessage] = useState('');
    const [loginEmail,setLoginEmail] = React.useState('');
    const [loginPassword,setLoginPassword] = React.useState('');

    function handleSetLoginEmail( e: any ) : void
    {
        setLoginEmail(e.target.value);
    }
    function handleSetLoginPassword( e: any) : void
    {
        setLoginPassword(e.target.value);
    }
    
    async function doLogin(event:any) : Promise<void>
    {
        event.preventDefault();
        var obj = {email:loginEmail,password:loginPassword};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch('http://localhost:5001/api/login',{method:'POST',body:js,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if(res.id < 0 || res.error.length !== 0 )
            {
                setMessage('Incorrect username and/or password.');
            }
            else
            {
                var user = {name:res.name,id:res.id};
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('Success!');
                window.location.href = '/dashboard';
                
            }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
    };

    return (
        <div id="loginDiv">
            <h1>Login</h1>
            <p>Enter login info here.</p>
            <div id="loginEmailDiv">
                <input type="text" id="loginEmail" placeholder="Email" onChange={handleSetLoginEmail}></input>
            </div>
            <div id="loginPasswordDiv">
                <input type="password" id="loginPassword" placeholder="Password" onChange={handleSetLoginPassword}></input>
            </div>
            
            <input type="submit" className="buttons" id="loginButton" value="Login" onClick={doLogin}></input>
            
            <span id="loginResult">{message}</span>
            <p>New user? Sign up <a href="/register">here</a>!</p>
        </div>
    );

};
export default Login;