function Login()
{
    function doLogin(event:any) : void
    {
        alert("Not yet implemented");
    }

    return (
        <div id="loginDiv">
            <h1>Login</h1>
            <p>Enter login info here.</p>
            <div id="loginNameDiv">
                <input type="text" id="loginName" placeholder="Username"></input>
            </div>
            <div id="loginPasswordDiv">
                <input type="password" id="loginPassword" placeholder="Password"></input>
            </div>
            
            <input type="submit" id="loginButton" value="Login"></input>
            
            <span id="loginResult"></span>
            <p>New user? Sign up <a href="/register">here</a>!</p>
        </div>
    );

};
export default Login;