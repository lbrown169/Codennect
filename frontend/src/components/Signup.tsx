function Signup()
{
    function doSignup(event:any) : void
    {
        alert("Not yet implemented");
    }
    return (
        <div id="signupDiv">
        <h1>Signup</h1>

        <form id="signupInput">
            <div id="emailDiv">
                <label for="signupEmail">Email: </label>
	            <input type="email" class="input" id="signupEmail" placeholder="Email"></input> 
            </div>
            <div id="usernameDiv">
                <label for="username">Username: </label>
                <input type="text" class="input" id="username" placeholder="Username"></input>
            </div>
            <div id="passwordDiv">
                <label for="password">Password: </label>
                <input type="password" class="input" id="password" placeholder="Password"></input>
            </div>
            <div id="passwordConfirmDiv">
                <label for="passwordConfirm">Re-enter password: </label>
                <input type="password" class="input" id="passwordConfirm" placeholder="Confirm Password"></input>
            </div>
      
            <input type="submit" id="submitButton" value="Create Account"></input>
        </form>
        <p>Already have an account? Login <a href="/login">here</a>!</p>

        </div>
    );

};
export default Signup;