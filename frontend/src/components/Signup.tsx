function Signup()
{
    function doSignup(event:any) : void
    {
        alert("Not yet implemented");
        event.preventDefault();
    }
    return (
        <div id="signupDiv">
        <h1>Signup</h1>

        <form id="signupInput">
            <div id="usernameDiv">
                <label>Full Name: 
                    <input type="text" className="signupInput" id="fullname" placeholder="Full Name"></input>
                </label>
            </div>
            <div id="emailDiv">
                <label for="signupEmail">Email: </label>
	            <input type="email" className="signupInput" id="signupEmail" placeholder="Email"></input> 
            </div>
            <div id="passwordDiv">
                <label for="password">Password: </label>
                <input type="password" className="signupInput" id="password" placeholder="Password"></input>
            </div>
            <div id="passwordConfirmDiv">
                <label for="passwordConfirm">Re-enter password: </label>
                <input type="password" className="signupInput" id="passwordConfirm" placeholder="Confirm Password"></input>
            </div>

            <span id="signupResult"></span>
      
            <input type="submit" id="submitButton" value="Create Account" onClick={doSignup}></input>
        </form>
        <p>Already have an account? Login <a href="/login">here</a>!</p>

        </div>
    );

};
export default Signup;