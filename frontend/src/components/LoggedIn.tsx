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
                <span id="fullName" className="text-black text-lg">Logged In As {userName}</span>
            </div>
        </div>
    );

};
export default LoggedIn;