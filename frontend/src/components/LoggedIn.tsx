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

    const doLogout = (event:any) =>
    {
        event.preventDefault();
        localStorage.removeItem("user_data");
        window.location.href = '/';
    };

    return(
        <div id="loggedInDiv">
            <div id="displayName">
                <span id="fullName">Logged In As {userName}</span>
            </div>
            <button type="button" id="logoutButton" onClick={doLogout}>Log Out</button>
        </div>
    );

};
export default LoggedIn;