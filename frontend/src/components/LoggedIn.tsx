function LoggedIn()
{
    var _ud = localStorage.getItem('user_data');
    if(_ud == null) //redirect if user not found
    {
        window.location.href = '/';
        return;
    }
    var userData = JSON.parse(_ud);
    //var userId = userData.id;
    var userName = userData.name;

    return(
        <div id="loggedInDiv">
            <div id="displayName">
                <h1 id="fullName" className="relative m-auto text-black text-center">Welcome, {userName}!</h1>
            </div>
        </div>
    );

};
export default LoggedIn;